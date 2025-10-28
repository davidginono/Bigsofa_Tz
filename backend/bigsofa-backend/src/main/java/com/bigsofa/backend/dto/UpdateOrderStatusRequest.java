package com.bigsofa.backend.dto;

import com.bigsofa.backend.model.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull OrderStatus status
) {
}

