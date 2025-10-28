package com.bigsofa.backend.dto;

import java.time.OffsetDateTime;
import java.util.List;

import com.bigsofa.backend.model.CustomerOrder;
import com.bigsofa.backend.model.OrderStatus;

public record OrderResponse(
        Long id,
        String customerName,
        String email,
        String phone,
        String addressLine1,
        String addressLine2,
        String city,
        Integer totalCents,
        OrderStatus status,
        OffsetDateTime createdAt,
        List<OrderItemResponse> items
) {

    public static OrderResponse fromEntity(CustomerOrder order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(OrderItemResponse::fromEntity)
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getEmail(),
                order.getPhone(),
                order.getAddressLine1(),
                order.getAddressLine2(),
                order.getCity(),
                order.getTotalCents(),
                order.getStatus(),
                order.getCreatedAt(),
                itemResponses
        );
    }
}

