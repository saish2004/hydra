package com.hydra.service;

import com.hydra.config.JwtTokenProvider;
import com.hydra.dto.*;
import com.hydra.exception.BadRequestException;
import com.hydra.model.*;
import com.hydra.repository.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final StreakRepository streakRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    // In-memory token store for forgot password (simulating reset tokens)
    private final ConcurrentHashMap<String, String> resetTokens = new ConcurrentHashMap<>();

    public AuthService(
            UserRepository userRepository,
            UserProfileRepository userProfileRepository,
            StreakRepository streakRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
        this.streakRepository = streakRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address already in use.");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match.");
        }

        // 1. Create User
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);

        // 2. Calculate Default Daily Water Goal: weight (kg) * 35 ml
        int defaultWaterGoal = (int) Math.round(request.getWeight() * 35.0);
        // Cap water goal between 1500ml and 4000ml for safety
        defaultWaterGoal = Math.max(1500, Math.min(4000, defaultWaterGoal));

        // 3. Create Profile
        UserProfile profile = UserProfile.builder()
                .user(savedUser)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .age(request.getAge())
                .gender(request.getGender())
                .weight(request.getWeight())
                .dailyWaterGoal(defaultWaterGoal)
                .remindersEnabled(true)
                .reminderInterval("2") // Default to every 2 hours
                .build();

        userProfileRepository.save(profile);

        // 4. Create initial Streak
        Streak streak = Streak.builder()
                .user(savedUser)
                .currentStreak(0)
                .bestStreak(0)
                .lastCheckInDate(null)
                .build();

        streakRepository.save(streak);

        // 5. Authenticate and return JWT token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials."));

        return AuthResponse.builder()
                .token(jwt)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User with this email does not exist.");
        }
        // In production, send email with verification token
        String token = UUID.randomUUID().toString();
        resetTokens.put(token, request.getEmail());
        
        // Log to console for local simulation / user retrieval
        System.out.println("RESET PASSWORD TOKEN GENERATED FOR " + request.getEmail() + ": " + token);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = resetTokens.remove(request.getToken());
        if (email == null) {
            throw new BadRequestException("Invalid or expired password reset token.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found."));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadRequestException("Not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
    }
}
