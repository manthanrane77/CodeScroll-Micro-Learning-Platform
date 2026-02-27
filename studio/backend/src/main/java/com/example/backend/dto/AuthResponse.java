package com.example.backend.dto;

public class AuthResponse {
    private String token;
    private UserDto user;

    public AuthResponse() {}

    public AuthResponse(String token, UserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public static class UserDto {
        private Long id;
        private String email;
        private String displayName;
        private String photoURL;
        private String role;

        public UserDto() {}

        public UserDto(Long id, String email, String displayName, String photoURL, String role) {
            this.id = id;
            this.email = email;
            this.displayName = displayName;
            this.photoURL = photoURL;
            this.role = role;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }

        public String getPhotoURL() { return photoURL; }
        public void setPhotoURL(String photoURL) { this.photoURL = photoURL; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
