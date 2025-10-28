package com.bigsofa.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderItemRequest(
        @NotNull Long furnitureItemId,
        @Positive Integer quantity
) {
}

