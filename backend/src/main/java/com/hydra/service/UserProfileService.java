package com.hydra.service;

import com.hydra.dto.UserProfileDto;
import com.hydra.exception.ResourceNotFoundException;
import com.hydra.model.User;
import com.hydra.model.UserProfile;
import com.hydra.repository.UserProfileRepository;
import com.hydra.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public UserProfileService(UserProfileRepository userProfileRepository, UserRepository userRepository, AuthService authService) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public UserProfileDto getProfile() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        UserProfile profile = userProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        return mapToDto(profile);
    }

    @Transactional
    public UserProfileDto updateProfile(UserProfileDto dto) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        UserProfile profile = userProfileRepository.findByUser(currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        profile.setFullName(dto.getFullName());
        profile.setAge(dto.getAge());
        profile.setGender(dto.getGender());
        profile.setWeight(dto.getWeight());
        profile.setDailyWaterGoal(dto.getDailyWaterGoal());
        profile.setRemindersEnabled(dto.getRemindersEnabled());
        profile.setReminderInterval(dto.getReminderInterval());

        // Update core User details as well
        currentUser.setFullName(dto.getFullName());
        userRepository.save(currentUser);

        UserProfile updatedProfile = userProfileRepository.save(profile);
        return mapToDto(updatedProfile);
    }

    private UserProfileDto mapToDto(UserProfile profile) {
        return UserProfileDto.builder()
                .fullName(profile.getFullName())
                .email(profile.getEmail())
                .age(profile.getAge())
                .gender(profile.getGender())
                .weight(profile.getWeight())
                .dailyWaterGoal(profile.getDailyWaterGoal())
                .remindersEnabled(profile.getRemindersEnabled())
                .reminderInterval(profile.getReminderInterval())
                .build();
    }
}
