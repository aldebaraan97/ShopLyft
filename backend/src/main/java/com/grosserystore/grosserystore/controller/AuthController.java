package com.grosserystore.grosserystore.controller;

import com.grosserystore.grosserystore.dto.LoginRequest;
import com.grosserystore.grosserystore.entity.User;
import com.grosserystore.grosserystore.security.JwtUtil;
import com.grosserystore.grosserystore.service.UserService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Authentications", description = "Authentication management APIs")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = userService.createUser(
                    user.getUsername(),
                    user.getPassword(),
                    user.getEmail()
            );
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            if (e.getMessage().contains("duplicate key") || e.getMessage().contains("username")) {
                return ResponseEntity.badRequest().body("Username already exists. Please choose a different username.");
            }
            return ResponseEntity.badRequest().body("Registration failed. Please try again.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for username: " + loginRequest.getUsername());
            
            // Check if user exists first
            User user = userService.getUserByUsername(loginRequest.getUsername());
            if (user == null) {
                System.out.println("User not found: " + loginRequest.getUsername());
                return ResponseEntity.badRequest().body("Invalid credentials");
            }
            
            System.out.println("User found: " + user.getUsername());
            System.out.println("Stored password hash: " + user.getPassword());
            
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            System.out.println("Authentication successful");

            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
            String token = jwtUtil.generateToken(userDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("message", "Login successful");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Login failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }
}
