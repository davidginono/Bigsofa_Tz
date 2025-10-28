package com.bigsofa.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidFurnitureUploadException extends RuntimeException {
    public InvalidFurnitureUploadException(String message) {
        super(message);
    }

    public InvalidFurnitureUploadException(String message, Throwable cause) {
        super(message, cause);
    }
}

