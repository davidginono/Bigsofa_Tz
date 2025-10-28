package com.bigsofa.backend.admin;

import java.util.List;

import com.bigsofa.backend.dto.FurnitureItemResponse;
import com.bigsofa.backend.dto.FurnitureUploadForm;
import com.bigsofa.backend.service.FurnitureService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/furniture")
public class AdminFurnitureController {

    private final AdminAuthService authService;
    private final FurnitureService furnitureService;

    public AdminFurnitureController(AdminAuthService authService, FurnitureService furnitureService) {
        this.authService = authService;
        this.furnitureService = furnitureService;
    }

    @GetMapping
    public List<FurnitureItemResponse> listAll(@RequestHeader("X-Admin-Token") String token) {
        authService.requireValidToken(token);
        return furnitureService.listAllItems().stream()
                .map(FurnitureItemResponse::fromEntity)
                .toList();
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public FurnitureItemResponse create(@RequestHeader("X-Admin-Token") String token,
                                        @ModelAttribute FurnitureUploadForm form) {
        authService.requireValidToken(token);
        var item = furnitureService.storeItem(
                form.getCategoryId(),
                form.getName(),
                form.getDescription(),
                form.getPriceCents(),
                form.getFile()
        );
        return FurnitureItemResponse.fromEntity(item);
    }

    @PutMapping(value = "{id}", consumes = {"multipart/form-data"})
    public FurnitureItemResponse update(@RequestHeader("X-Admin-Token") String token,
                                        @PathVariable Long id,
                                        @ModelAttribute AdminUpdateForm form) {
        authService.requireValidToken(token);
        MultipartFile file = form.getFile();
        var item = furnitureService.updateItem(
                id,
                form.getCategoryId(),
                form.getName(),
                form.getDescription(),
                form.getPriceCents(),
                file);
        return FurnitureItemResponse.fromEntity(item);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> delete(@RequestHeader("X-Admin-Token") String token,
                                       @PathVariable Long id) {
        authService.requireValidToken(token);
        furnitureService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
