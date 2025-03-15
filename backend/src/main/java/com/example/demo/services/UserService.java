package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Async
    @Retryable(
        value = { DataAccessException.class, DataIntegrityViolationException.class },
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 2)
    )
    @Transactional
    public CompletableFuture<User> createUser(User user) {
        try {
            // Check if email already exists before saving
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return CompletableFuture.failedFuture(new DataIntegrityViolationException("Email must be unique!"));
            }

            // Hash password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));

            // Save user
            User savedUser = userRepository.save(user);
            return CompletableFuture.completedFuture(savedUser);
        } catch (DataIntegrityViolationException e) {
            return CompletableFuture.failedFuture(new DataIntegrityViolationException("Email must be unique!", e));
        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }

    @Async
    @Retryable(
        value = { DataAccessException.class },
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 2)
    )
    @Transactional
    public CompletableFuture<Void> deleteUser(UUID id) {
        try {
            Optional<User> user = userRepository.findById(id);
            if (user.isEmpty()) {
                return CompletableFuture.failedFuture(new RuntimeException("User not found!"));
            }

            userRepository.deleteById(id);
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }

    @Async
    @Retryable(
        value = { DataAccessException.class },
        maxAttempts = 3,
        backoff = @Backoff(delay = 2000, multiplier = 2)
    )
    public CompletableFuture<List<User>> getAllUsers() {
        try {
            return CompletableFuture.completedFuture(userRepository.findAll());
        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }
}
