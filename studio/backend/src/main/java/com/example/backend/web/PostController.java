package com.example.backend.web;

import com.example.backend.model.Post;
import com.example.backend.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private static final Logger log = LoggerFactory.getLogger(PostController.class);
    private final PostService svc;

    public PostController(PostService svc) { this.svc = svc; }

    @GetMapping
    public List<com.example.backend.web.dto.PostResponseDto> list(@RequestParam(required = false) String q,
                                                                  @RequestParam(required = false) String status,
                                                                  @RequestParam(required = false) String userId) {
        log.info("GET /api/posts called with q='{}' status='{}' userId='{}'", q, status, userId);
        var posts = (q != null && !q.isEmpty()) ? svc.search(q) : svc.listAll();
        
        // Filter by status if provided (default to 'approved' for public feed)
        if (status == null || status.isEmpty()) {
            status = "approved"; // Default to approved posts only
        }
        final String filterStatus = status;
        posts = posts.stream()
            .filter(p -> filterStatus.equals(p.getStatus()))
            .toList();
            
        return posts.stream().map(svc::toPostDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<com.example.backend.web.dto.PostResponseDto> get(@PathVariable Long id) {
        return svc.get(id).map(p -> ResponseEntity.ok(svc.toPostDto(p))).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<com.example.backend.web.dto.PostResponseDto> create(@Validated @RequestBody com.example.backend.web.dto.PostResponseDto dto) {
        log.info("POST /api/posts create called; incoming dto: title='{}' authorPresent={}", dto.title, dto.author != null);
        Post p = new Post();
        p.setTitle(dto.title);
        p.setContent(dto.content);
        if (dto.author != null) {
            p.setAuthorName(dto.author.name);
            p.setAuthorEmail(dto.author.email);
            p.setAuthorAvatarUrl(dto.author.avatarUrl);
        } else {
            // Fallbacks: allow front-end to send flattened author fields in future
            log.warn("create: no author object present in DTO; author fields will be null or defaulted");
            p.setAuthorName("Anonymous");
        }
        p.setTopic(dto.topic);
        p.setImageUrl(dto.imageUrl);
        p.setStatus(dto.status != null ? dto.status : "pending");
        Post created = svc.create(p);
        log.info("Created post id={}", created.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(svc.toPostDto(created));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<com.example.backend.web.dto.PostResponseDto> updateStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        log.info("PUT /api/posts/{}/status called with body={}", id, body);
        String status = body.get("status");
        if (status == null || (!status.equals("approved") && !status.equals("pending"))) {
            log.warn("updateStatus: invalid status value={}", status);
            return ResponseEntity.badRequest().body(null);
        }
        var opt = svc.updateStatus(id, status);
        if (opt.isEmpty()) {
            log.warn("updateStatus: post id={} not found", id);
            return ResponseEntity.notFound().build();
        }
        log.info("updateStatus: post id={} updated to status={}", id, status);
        return ResponseEntity.ok(svc.toPostDto(opt.get()));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<com.example.backend.web.dto.PostResponseDto> like(@PathVariable Long id) {
        return svc.get(id).map(post -> {
            post.setLikes(post.getLikes() == null ? 1 : post.getLikes() + 1);
            Post saved = svc.create(post);
            return ResponseEntity.ok(svc.toPostDto(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/dislike")
    public ResponseEntity<com.example.backend.web.dto.PostResponseDto> dislike(@PathVariable Long id) {
        return svc.get(id).map(post -> {
            post.setDislikes(post.getDislikes() == null ? 1 : post.getDislikes() + 1);
            Post saved = svc.create(post);
            return ResponseEntity.ok(svc.toPostDto(saved));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        String content = body.get("content");
        if (content == null || content.isEmpty()) return ResponseEntity.badRequest().body("content required");
        return svc.get(id).map(post -> {
            var created = svc.addCommentToPost(post, body.getOrDefault("authorName", "Anonymous"), body.getOrDefault("authorEmail", ""), content);
            return ResponseEntity.status(HttpStatus.CREATED).body(svc.toCommentDto(created));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("DELETE /api/posts/{} called", id);
        var opt = svc.get(id);
        if (opt.isEmpty()) {
            log.warn("delete: post id={} not found", id);
            return ResponseEntity.notFound().build();
        }
        svc.delete(id);
        log.info("delete: post id={} deleted successfully", id);
        return ResponseEntity.noContent().build();
    }
}
