package com.rms.controller;

import com.rms.dto.restauranttable.request.AddTableRequest;
import com.rms.dto.restauranttable.request.UpdateTableRequest;
import com.rms.service.RestaurantTableService;
import com.rms.util.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/table/v1")
@RequiredArgsConstructor
public class RestaurantTableController {

    private final RestaurantTableService restaurantTableService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<Object>> addTable(
            @Valid @RequestBody AddTableRequest request) {
        return restaurantTableService.addTable(request);
    }

    @GetMapping("/get/{tableId}")
    public ResponseEntity<ApiResponse<Object>> getTableById(
            @PathVariable Integer tableId) {
        return restaurantTableService.getTableById(tableId);
    }

    @GetMapping("/get-all")
    public ResponseEntity<ApiResponse<Object>> getAllTables() {
        return restaurantTableService.getAllTables();
    }

    @PatchMapping("/update/{tableId}")
    public ResponseEntity<ApiResponse<Object>> updateTable(
            @PathVariable Integer tableId,
            @Valid @RequestBody UpdateTableRequest request) {
        return restaurantTableService.updateTable(tableId, request);
    }

    @DeleteMapping("/delete/{tableId}")
    public ResponseEntity<ApiResponse<Object>> deleteTable(
            @PathVariable Integer tableId) {
        return restaurantTableService.deleteTable(tableId);
    }
}