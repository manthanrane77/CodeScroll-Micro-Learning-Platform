package com.example.backend.web;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestPart;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
    private static final Logger log = LoggerFactory.getLogger(UploadController.class);

    private final Path uploadsRoot = Paths.get("uploads").toAbsolutePath().normalize();

    public UploadController() {
        try {
            Files.createDirectories(uploadsRoot);
        } catch (IOException e) {
            log.warn("Could not create uploads directory {}", uploadsRoot, e);
        }
    }

    @PostMapping
    public ResponseEntity<?> upload(@RequestPart("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "file required"));
        }
    String originalProvided = file.getOriginalFilename();
    String original = originalProvided == null ? "" : StringUtils.cleanPath(originalProvided);
    String ext = "";
    int i = original.lastIndexOf('.');
    if (i >= 0) ext = original.substring(i);
        String name = UUID.randomUUID().toString() + ext;
        Path target = uploadsRoot.resolve(name);
        try {
            Files.copy(file.getInputStream(), target);
            // Return full URL including protocol and host for frontend to load images from backend
            String url = "http://localhost:8081/uploads/" + name;
            Map<String, String> resp = new HashMap<>();
            resp.put("url", url);
            return ResponseEntity.status(HttpStatus.CREATED).body(resp);
        } catch (IOException e) {
            log.error("Failed to store upload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "cannot store file"));
        }
    }
}
