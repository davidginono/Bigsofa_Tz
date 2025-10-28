package com.bigsofa.backend.admin;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class AdminUnauthorizedException extends RuntimeException {
    public AdminUnauthorizedException(String message) {
        super(message);
    }
}

