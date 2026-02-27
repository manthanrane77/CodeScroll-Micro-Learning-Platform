package com.example.backend.web.dto;

public class AuthorDto {
    public String name;
    public String avatarUrl;
    public String email;

    public AuthorDto() {}
    public AuthorDto(String name, String avatarUrl, String email) {
        this.name = name;
        this.avatarUrl = avatarUrl;
        this.email = email;
    }
}
