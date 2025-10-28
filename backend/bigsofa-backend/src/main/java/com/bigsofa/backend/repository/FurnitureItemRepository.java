package com.bigsofa.backend.repository;

import java.util.List;
import java.util.Optional;

import com.bigsofa.backend.model.FurnitureItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FurnitureItemRepository extends JpaRepository<FurnitureItem, Long> {
    List<FurnitureItem> findByCategory_NameIgnoreCaseOrderByCreatedAtDesc(String categoryName);
    List<FurnitureItem> findByCategory_IdOrderByCreatedAtDesc(Long categoryId);
    List<FurnitureItem> findAllByOrderByCreatedAtDesc();
    Optional<FurnitureItem> findByImageHash(String imageHash);
    Optional<FurnitureItem> findByImageHashAndIdNot(String imageHash, Long id);
}
