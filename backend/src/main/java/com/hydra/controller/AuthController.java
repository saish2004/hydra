package com.hydra.controller;

import com.hydra.dto.*;
import com.hydra.model.User;
import com.hydra.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MapResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(new MapResponse("Verification code/link sent successfully to your email."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MapResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new MapResponse("Password reset completed successfully."));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(new UserResponse(user.getFullName(), user.getEmail(), user.getRole().name()));
    }

    // Simple response DTOs for standard text responses
    private static class MapResponse {
        private final String message;
        public MapResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
    }

    private static class UserResponse {
        private final String fullName;
        private final String email;
        private final String role;

        public UserResponse(String fullName, String email, String role) {
            this.fullName = fullName;
            this.email = email;
            this.role = role;
        }

        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}
