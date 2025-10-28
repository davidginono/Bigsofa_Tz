package com.bigsofa.backend.service;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import com.bigsofa.backend.exception.CategoryNotFoundException;
import com.bigsofa.backend.exception.FurnitureItemNotFoundException;
import com.bigsofa.backend.exception.InvalidFurnitureUploadException;
import com.bigsofa.backend.model.FurnitureCategory;
import com.bigsofa.backend.model.FurnitureItem;
import com.bigsofa.backend.repository.FurnitureCategoryRepository;
import com.bigsofa.backend.repository.FurnitureItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FurnitureService {

    private static final Logger log = LoggerFactory.getLogger(FurnitureService.class);

    private final FurnitureCategoryRepository categoryRepository;
    private final FurnitureItemRepository itemRepository;

    public FurnitureService(FurnitureCategoryRepository categoryRepository,
                            FurnitureItemRepository itemRepository) {
        this.categoryRepository = categoryRepository;
        this.itemRepository = itemRepository;
    }

    public List<FurnitureItem> listItemsByCategoryId(Long categoryId) {
        return itemRepository.findByCategory_IdOrderByCreatedAtDesc(categoryId);
    }

    public List<FurnitureItem> listItemsByCategoryName(String categoryName) {
        return itemRepository.findByCategory_NameIgnoreCaseOrderByCreatedAtDesc(categoryName);
    }

    public List<FurnitureItem> listAllItems() {
        return itemRepository.findAllByOrderByCreatedAtDesc();
    }

    public FurnitureItem getItem(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new FurnitureItemNotFoundException(id));
    }

    @Transactional
    public FurnitureItem storeItem(Long categoryId,
                                   String name,
                                   String description,
                                   Integer priceCents,
                                   MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFurnitureUploadException("Image file must not be empty");
        }

        FurnitureCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryNotFoundException(categoryId));

        try {
            byte[] bytes = file.getBytes();
            String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
            String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload";
            String imageHash = computeHash(bytes);

            itemRepository.findByImageHash(imageHash).ifPresent(existing -> {
                throw new InvalidFurnitureUploadException("An identical image already exists.");
            });

            FurnitureItem item = new FurnitureItem(
                    name,
                    description,
                    priceCents,
                    contentType,
                    fileName,
                    bytes,
                    imageHash,
                    category
            );

            try {
                return itemRepository.save(item);
            } catch (DataAccessException ex) {
                log.error("Failed to save furniture item '{}' in category {}", name, categoryId, ex);
                String reason = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
                throw new InvalidFurnitureUploadException("Database error while saving furniture item: " + reason, ex);
            }
        } catch (IOException ex) {
            throw new InvalidFurnitureUploadException("Failed to read image data", ex);
        }
    }

    @Transactional
    public FurnitureItem updateItem(Long id,
                                    Long categoryId,
                                    String name,
                                    String description,
                                    Integer priceCents,
                                    MultipartFile file) {
        FurnitureItem item = itemRepository.findById(id)
                .orElseThrow(() -> new FurnitureItemNotFoundException(id));

        if (categoryId != null && !categoryId.equals(item.getCategory().getId())) {
            FurnitureCategory category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new CategoryNotFoundException(categoryId));
            item.setCategory(category);
        }

        if (name != null) {
            item.setName(name);
        }
        if (description != null) {
            item.setDescription(description);
        }
        if (priceCents != null) {
            item.setPriceCents(priceCents);
        }

        if (file != null && !file.isEmpty()) {
            try {
                byte[] bytes = file.getBytes();
                String newHash = computeHash(bytes);
                itemRepository.findByImageHashAndIdNot(newHash, id).ifPresent(existing -> {
                    throw new InvalidFurnitureUploadException("An identical image already exists.");
                });
                item.setImageData(bytes);
                item.setImageHash(newHash);
                item.setContentType(file.getContentType() != null ? file.getContentType() : item.getContentType());
                if (file.getOriginalFilename() != null) {
                    item.setFileName(file.getOriginalFilename());
                }
            } catch (IOException ex) {
                throw new InvalidFurnitureUploadException("Failed to read image data", ex);
            }
        }

        return itemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new FurnitureItemNotFoundException(id);
        }
        itemRepository.deleteById(id);
    }

    private String computeHash(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder sb = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 algorithm not available", ex);
        }
    }
}
