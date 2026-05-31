package com.hydra.controller;

import com.hydra.dto.UserProfileDto;
import com.hydra.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public ResponseEntity<UserProfileDto> getProfile() {
        return ResponseEntity.ok(userProfileService.getProfile());
    }

    @PutMapping
    public ResponseEntity<UserProfileDto> updateProfile(@Valid @RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(userProfileService.updateProfile(dto));
    }
}
