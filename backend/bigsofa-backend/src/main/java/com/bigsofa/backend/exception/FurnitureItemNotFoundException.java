package com.bigsofa.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class FurnitureItemNotFoundException extends RuntimeException {
    public FurnitureItemNotFoundException(Long id) {
        super("Furniture item with id %d not found".formatted(id));
    }
}

