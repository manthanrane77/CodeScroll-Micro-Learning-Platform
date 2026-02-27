package com.example.backend.controller;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.UpdateProfileRequest;
import com.example.backend.model.User;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:9002"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            
            // Build user DTO with role
            String role = "user";
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                boolean isAdmin = user.getRoles().stream()
                        .anyMatch(r -> "ADMIN".equalsIgnoreCase(r.getName()));
                if (isAdmin) {
                    role = "admin";
                }
            }

            AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getPhotoUrl(),
                    role
            );

            return ResponseEntity.ok(userDto);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(404).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch user profile");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody UpdateProfileRequest request) {
        try {
            User updatedUser = userService.updateProfile(id, request);

            // Build user DTO
            String role = "user";
            if (updatedUser.getRoles() != null && !updatedUser.getRoles().isEmpty()) {
                boolean isAdmin = updatedUser.getRoles().stream()
                        .anyMatch(r -> "ADMIN".equalsIgnoreCase(r.getName()));
                if (isAdmin) {
                    role = "admin";
                }
            }

            AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                    updatedUser.getId(),
                    updatedUser.getEmail(),
                    updatedUser.getFullName(),
                    updatedUser.getPhotoUrl(),
                    role
            );

            return ResponseEntity.ok(userDto);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update profile");
            return ResponseEntity.status(500).body(error);
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(id, request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(400).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to change password");
            return ResponseEntity.status(500).body(error);
        }
    }
}
