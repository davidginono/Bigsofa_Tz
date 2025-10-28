package com.bigsofa.backend.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
        @NotBlank @Size(max = 128) String customerName,
        @NotBlank @Email @Size(max = 128) String email,
        @Size(max = 32) String phone,
        @NotBlank @Size(max = 255) String addressLine1,
        @Size(max = 255) String addressLine2,
        @Size(max = 128) String city,
        @NotEmpty List<@Valid OrderItemRequest> items
) {
}

