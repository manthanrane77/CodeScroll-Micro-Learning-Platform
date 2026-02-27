package com.example.backend.service;

import com.example.backend.model.Comment;
import com.example.backend.model.Post;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    private final PostRepository repo;
    private final CommentRepository commentRepo;

    public PostService(PostRepository repo, CommentRepository commentRepo) {
        this.repo = repo;
        this.commentRepo = commentRepo;
    }

    public Post create(Post p) { return repo.save(p); }

    public Optional<Post> get(Long id) { return repo.findById(id); }

    public List<Post> search(String q) { return repo.findByTitleContainingIgnoreCase(q); }

    public List<Post> listAll() { return repo.findAll(); }

    public Comment addCommentToPost(Post post, String authorName, String authorEmail, String content) {
        Comment c = new Comment();
        c.setPost(post);
        c.setAuthorName(authorName);
        c.setAuthorEmail(authorEmail);
        c.setContent(content);
        return commentRepo.save(c);
    }

    public java.util.Optional<Post> updateStatus(Long id, String status) {
        var opt = repo.findById(id);
        opt.ifPresent(p -> {
            p.setStatus(status);
            repo.save(p);
        });
        return opt;
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    // Mapping helpers for API DTOs
    public com.example.backend.web.dto.CommentResponseDto toCommentDto(Comment c) {
        com.example.backend.web.dto.CommentResponseDto dto = new com.example.backend.web.dto.CommentResponseDto();
        dto.id = String.valueOf(c.getId());
        dto.content = c.getContent();
        dto.createdAt = c.getCreatedAt().toString();
    dto.author = new com.example.backend.web.dto.AuthorDto(c.getAuthorName(), null, c.getAuthorEmail());
        return dto;
    }

    public com.example.backend.web.dto.PostResponseDto toPostDto(Post p) {
        com.example.backend.web.dto.PostResponseDto dto = new com.example.backend.web.dto.PostResponseDto();
        dto.id = String.valueOf(p.getId());
        dto.title = p.getTitle();
        dto.content = p.getContent();
        dto.createdAt = p.getCreatedAt().toString();
        dto.likes = p.getLikes() == null ? 0 : p.getLikes();
        dto.dislikes = p.getDislikes() == null ? 0 : p.getDislikes();
        dto.topic = p.getTopic();
        dto.imageUrl = p.getImageUrl();
        dto.status = p.getStatus();
        dto.author = new com.example.backend.web.dto.AuthorDto(p.getAuthorName(), p.getAuthorAvatarUrl(), p.getAuthorEmail());
        var comments = commentRepo.findByPostId(p.getId());
        dto.comments = comments.stream().map(this::toCommentDto).toList();
        return dto;
    }
}
