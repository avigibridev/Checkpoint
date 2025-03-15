package com.example.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.components.OperationStatusStore;

@RestController
@RequestMapping("/status")
public class StatusController {
    private final OperationStatusStore statusStore;

    public StatusController(OperationStatusStore statusStore) {
        this.statusStore = statusStore;
    }

    @GetMapping("/{operationId}")
    public ResponseEntity<String> getStatus(@PathVariable String operationId) {
        return ResponseEntity.ok(statusStore.getStatus(operationId));
    }
}
