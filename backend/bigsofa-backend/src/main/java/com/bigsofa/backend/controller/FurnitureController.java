package com.bigsofa.backend.controller;

import java.util.List;

import com.bigsofa.backend.dto.FurnitureItemResponse;
import com.bigsofa.backend.dto.FurnitureUploadForm;
import com.bigsofa.backend.model.FurnitureItem;
import com.bigsofa.backend.service.FurnitureService;
import jakarta.validation.Valid;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/furniture")
public class FurnitureController {

    private final FurnitureService furnitureService;

    public FurnitureController(FurnitureService furnitureService) {
        this.furnitureService = furnitureService;
    }

    @GetMapping
    public List<FurnitureItemResponse> listFurniture(@RequestParam(required = false) Long categoryId,
                                                     @RequestParam(required = false) String categoryName) {
        List<FurnitureItem> items;
        if (categoryId != null) {
            items = furnitureService.listItemsByCategoryId(categoryId);
        } else if (categoryName != null && !categoryName.isBlank()) {
            items = furnitureService.listItemsByCategoryName(categoryName);
        } else {
            items = furnitureService.listAllItems();
        }

        return items.stream().map(FurnitureItemResponse::fromEntity).toList();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FurnitureItemResponse uploadFurniture(@Valid @ModelAttribute FurnitureUploadForm form) {
        FurnitureItem item = furnitureService.storeItem(
                form.getCategoryId(),
                form.getName(),
                form.getDescription(),
                form.getPriceCents(),
                form.getFile()
        );
        return FurnitureItemResponse.fromEntity(item);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<ByteArrayResource> loadImage(@PathVariable Long id) {
        FurnitureItem item = furnitureService.getItem(id);

        ByteArrayResource resource = new ByteArrayResource(item.getImageData());
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(item.getContentType()));
        headers.setContentLength(item.getImageData().length);
        headers.setContentDispositionFormData("inline", item.getFileName());
        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
    }
}
