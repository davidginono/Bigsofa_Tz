package com.bigsofa.backend.dto;

import com.bigsofa.backend.model.FurnitureItem;

public record FurnitureItemResponse(
        Long id,
        String name,
        Integer priceCents,
        String description,
        Long categoryId,
        String category,
        String imageUrl,
        String contentType
) {
    public static FurnitureItemResponse fromEntity(FurnitureItem item) {
        return new FurnitureItemResponse(
                item.getId(),
                item.getName(),
                item.getPriceCents(),
                item.getDescription(),
                item.getCategory().getId(),
                item.getCategory().getName(),
                "/api/furniture/%d/image".formatted(item.getId()),
                item.getContentType()
        );
    }
}
