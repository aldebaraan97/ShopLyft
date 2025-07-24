package com.grosserystore.grosserystore.controller;

import com.grosserystore.grosserystore.dto.LoginRequest;
import com.grosserystore.grosserystore.entity.User;
import com.grosserystore.grosserystore.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User newUser = userService.createUser(
                user.getUsername(),
                user.getPassword(),
                user.getEmail()
        );
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("username", user.getUsername());
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }
}