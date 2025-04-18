package com.to.backend.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String resource, String id) {
        super(resource + " not found with id: " + id);
    }
}

