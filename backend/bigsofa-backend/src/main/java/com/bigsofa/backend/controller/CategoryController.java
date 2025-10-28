package com.bigsofa.backend.controller;

import java.util.List;

import com.bigsofa.backend.dto.CreateCategoryRequest;
import com.bigsofa.backend.exception.CategoryNotFoundException;
import com.bigsofa.backend.model.FurnitureCategory;
import com.bigsofa.backend.repository.FurnitureCategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final FurnitureCategoryRepository categoryRepository;

    public CategoryController(FurnitureCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<FurnitureCategory> listCategories() {
        return categoryRepository.findAll().stream()
                .sorted((a, b) -> a.getName().compareToIgnoreCase(b.getName()))
                .toList();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public FurnitureCategory createCategory(@RequestBody @Validated CreateCategoryRequest request) {
        return categoryRepository.findByNameIgnoreCase(request.name())
                .orElseGet(() -> categoryRepository.save(new FurnitureCategory(request.name())));
    }

    @GetMapping("/{id}")
    public FurnitureCategory getCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(id));
    }
}
