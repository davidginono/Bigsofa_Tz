package com.bigsofa.backend.dto;

import com.bigsofa.backend.model.OrderItem;

public record OrderItemResponse(
        Long id,
        Long furnitureItemId,
        String itemName,
        Integer priceCents,
        Integer quantity
) {

    public static OrderItemResponse fromEntity(OrderItem item) {
        Long furnitureId = item.getFurnitureItem() != null ? item.getFurnitureItem().getId() : null;
        return new OrderItemResponse(
                item.getId(),
                furnitureId,
                item.getItemName(),
                item.getPriceCents(),
                item.getQuantity()
        );
    }
}

