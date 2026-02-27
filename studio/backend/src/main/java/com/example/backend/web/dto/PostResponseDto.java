package com.example.backend.web.dto;

import java.util.List;

public class PostResponseDto {
    public String id;
    public AuthorDto author;
    public String topic;
    public String title;
    public String imageUrl;
    public String content;
    public String createdAt;
    public String status;
    public int likes;
    public int dislikes;
    public List<CommentResponseDto> comments;

    public PostResponseDto() {}
}
