package com.example.demo.components;

import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class OperationStatusStore {
    private final ConcurrentHashMap<String, String> statusMap = new ConcurrentHashMap<>();

    public void setStatus(String operationId, String status) {
        statusMap.put(operationId, status);
    }

    public String getStatus(String operationId) {
        return statusMap.getOrDefault(operationId, "Unknown");
    }
}
