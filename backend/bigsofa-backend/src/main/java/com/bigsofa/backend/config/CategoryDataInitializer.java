package com.bigsofa.backend.config;

import java.util.List;

import com.bigsofa.backend.model.FurnitureCategory;
import com.bigsofa.backend.repository.FurnitureCategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CategoryDataInitializer implements CommandLineRunner {

    private static final List<String> DEFAULT_CATEGORIES = List.of(
            "Sofas",
            "Chairs",
            "Tables"
    );

    private final FurnitureCategoryRepository repository;

    public CategoryDataInitializer(FurnitureCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        DEFAULT_CATEGORIES.forEach(name -> repository.findByNameIgnoreCase(name)
                .orElseGet(() -> repository.save(new FurnitureCategory(name))));
    }
}
