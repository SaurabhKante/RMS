package com.rms.controller;

import com.rms.dto.dish.request.AddChildDishRequest;
import com.rms.dto.dish.request.UpdateDishRequest;
import com.rms.service.DishService;
import com.rms.service.S3Service;
import com.rms.util.ApiResponse;
import com.rms.util.ResponseHandler;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/dish/v1")
@RequiredArgsConstructor
public class DishController {

    private final DishService dishService;
    private final S3Service s3Service;

    // ─────────────────────────────────────────────────────────────
    // Image Upload
    // ─────────────────────────────────────────────────────────────

    /**
     * Uploads a dish image to AWS S3 and returns the public URL.
     * <p>
     * Request : multipart/form-data — part name "file"
     * Response: { success, message, data: { imageUrl: "https://..." } }
     */
    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Object>> uploadDishImage(
            @RequestPart("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return ResponseHandler.failure(
                    HttpStatus.BAD_REQUEST,
                    "No file provided or file is empty.",
                    null
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseHandler.failure(
                    HttpStatus.BAD_REQUEST,
                    "Only image files (jpeg, png, webp, etc.) are allowed.",
                    null
            );
        }

        String imageUrl = s3Service.uploadDishImage(file);

        return ResponseHandler.success(
                "Image uploaded successfully.",
                Map.of("imageUrl", imageUrl)
        );
    }

    // ─────────────────────────────────────────────────────────────
    // Dish CRUD
    // ─────────────────────────────────────────────────────────────

    @PostMapping("/add-parent-dish/{dishName}")
    public ResponseEntity<ApiResponse<Object>> addParentDish(@PathVariable String dishName) {
        return dishService.addParentDish(dishName);
    }

    @PostMapping("/add-child-dish")
    public ResponseEntity<ApiResponse<Object>> addChildDish(@Valid @RequestBody AddChildDishRequest dishRequest) {
        return dishService.addChildDish(dishRequest);
    }

    @GetMapping("/get-childs/{parentDishId}")
    public ResponseEntity<ApiResponse<Object>> getChildDishes(
            @PathVariable Integer parentDishId) {
        return dishService.getChildDishes(parentDishId);
    }

    @GetMapping("/get-all-childs")
    public ResponseEntity<ApiResponse<Object>> getAllChildDishes() {
        return dishService.getAllChildDishes();
    }

    @GetMapping("/get-all-parents")
    public ResponseEntity<ApiResponse<Object>> getAllParentDishes() {
        return dishService.getAllParentDishes();
    }

    @DeleteMapping("/remove-parent-dish/{parentDishId}")
    public ResponseEntity<ApiResponse<Object>> deleteParentDish(
            @PathVariable Integer parentDishId) {
        return dishService.deleteParentDish(parentDishId);
    }

    @DeleteMapping("remove-child-dish/{childDishId}")
    public ResponseEntity<ApiResponse<Object>> deleteChildDish(
            @PathVariable Integer childDishId) {
        return dishService.deleteChildDish(childDishId);
    }

    @PatchMapping("update-parent-dish/{parentDishId}")
    public ResponseEntity<ApiResponse<Object>> updateParentDish(
            @PathVariable Integer parentDishId, @RequestBody String dishName) {
        return dishService.updateParentDish(parentDishId, dishName);
    }

    @PutMapping("update-child-dish")
    public ResponseEntity<ApiResponse<Object>> updateChildDish(
            @RequestBody UpdateDishRequest dish) {
        return dishService.updateChildDish(dish);
    }

    @GetMapping("get-dish/{childDishId}")
    public ResponseEntity<ApiResponse<Object>> getChildDish(
            @PathVariable Integer childDishId) {
        return dishService.getChildDish(childDishId);
    }
}
