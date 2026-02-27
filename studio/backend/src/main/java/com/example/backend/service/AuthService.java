package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.model.Role;
import com.example.backend.model.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private final Key jwtKey;
    private final long jwtExpirationMs;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository,
                       @Value("${jwt.secret}") String jwtSecret,
                       @Value("${jwt.expiration-ms}") long jwtExpirationMs) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setFullName(req.getFullName());

        // give default USER role if exists
        roleRepository.findByName("USER").ifPresent(role -> {
            Set<Role> roles = new HashSet<>();
            roles.add(role);
            user.setRoles(roles);
        });

        userRepository.save(user);

        String token = generateToken(user);
        AuthResponse.UserDto userDto = buildUserDto(user);
        return new AuthResponse(token, userDto);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = generateToken(user);
        AuthResponse.UserDto userDto = buildUserDto(user);
        return new AuthResponse(token, userDto);
    }

    private AuthResponse.UserDto buildUserDto(User user) {
        String role = "user";
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            // Check if user has ADMIN role
            boolean isAdmin = user.getRoles().stream()
                    .anyMatch(r -> "ADMIN".equalsIgnoreCase(r.getName()));
            if (isAdmin) {
                role = "admin";
            }
        }

        return new AuthResponse.UserDto(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhotoUrl(), // photoURL from database
                role
        );
    }

    private String generateToken(User user) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("email", user.getEmail())
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(jwtKey, SignatureAlgorithm.HS256)
                .compact();
    }
}
