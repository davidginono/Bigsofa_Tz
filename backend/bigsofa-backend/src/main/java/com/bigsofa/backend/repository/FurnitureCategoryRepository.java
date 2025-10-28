package com.bigsofa.backend.repository;

import java.util.Optional;

import com.bigsofa.backend.model.FurnitureCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FurnitureCategoryRepository extends JpaRepository<FurnitureCategory, Long> {
    Optional<FurnitureCategory> findByNameIgnoreCase(String name);
}

