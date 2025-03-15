package com.example.demo.controllers;

import com.example.demo.models.User;
import com.example.demo.models.UserDTO;
import com.example.demo.services.UserService;

import jakarta.validation.Valid;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<String> createUser(@Valid @RequestBody User user) {
        CompletableFuture<User> createdUserFuture = userService.createUser(user);

        return createdUserFuture.handle((userResult, ex) -> {
            if (ex != null) {
                if (ex.getCause() instanceof DataIntegrityViolationException) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Email must be unique!");
                }
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error creating user: " + ex.getMessage());
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User created successfully.");
        }).join();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        CompletableFuture<Void> deleteUserFuture = userService.deleteUser(id);

        return deleteUserFuture.handle((result, ex) -> {
            if (ex != null) {
                if (ex.getCause() instanceof RuntimeException) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("User not found!");
                }
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error deleting user: " + ex.getMessage());
            }

            return ResponseEntity.status(HttpStatus.OK)
                    .body("User deleted successfully.");
        }).join();
    }

    @GetMapping
    public CompletableFuture<List<UserDTO>> getAllUsers() {
        return userService.getAllUsers()
                .thenApply(users -> users.stream()
                        .map(user -> new UserDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail()))
                        .toList());
    }
}
