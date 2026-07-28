package com.rms.service.impl;
import com.rms.dto.restauranttable.request.AddTableRequest;
import com.rms.dto.restauranttable.request.UpdateTableRequest;
import com.rms.dto.restauranttable.response.GetTableResponse;
import com.rms.entity.RestaurantTable;
import com.rms.exception.BadRequestException;
import com.rms.exception.ResourceNotFoundException;
import com.rms.repository.RestaurantTableRepository;
import com.rms.service.RestaurantTableService;
import com.rms.util.ApiResponse;
import com.rms.util.ResponseHandler;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantTableServiceImpl implements RestaurantTableService {

    private final RestaurantTableRepository restaurantTableRepository;

    @Override
    public ResponseEntity<ApiResponse<Object>> addTable(AddTableRequest request) {

        if (restaurantTableRepository.existsByTableName(request.getTableName().trim())) {
            throw new BadRequestException("Table name already exists.");
        }

        RestaurantTable table = new RestaurantTable();

        table.setTableName(request.getTableName().trim());
        table.setSeatCapacity(request.getSeatCapacity());

        restaurantTableRepository.save(table);

        return ResponseHandler.created(
                "Table added successfully.",
                null
        );
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> getTableById(Integer tableId) {

        RestaurantTable table = getActiveTable(tableId);

        GetTableResponse response = GetTableResponse.builder()
                .tableId(table.getTableId())
                .tableName(table.getTableName())
                .seatCapacity(table.getSeatCapacity())
                .build();

        return ResponseHandler.success(
                "Table fetched successfully.",
                response
        );
    }

    @Override
    public ResponseEntity<ApiResponse<Object>> getAllTables() {

        List<GetTableResponse> response = restaurantTableRepository
                .findAllByIsActiveTrue()
                .stream()
                .map(table -> GetTableResponse.builder()
                        .tableId(table.getTableId())
                        .tableName(table.getTableName())
                        .seatCapacity(table.getSeatCapacity())
                        .build())
                .collect(Collectors.toList());

        return ResponseHandler.success(
                "Tables fetched successfully.",
                response
        );
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> updateTable(
            Integer tableId,
            UpdateTableRequest request) {

        RestaurantTable table = getActiveTable(tableId);

        // Update Table Name
        if (request.getTableName() != null &&
                !request.getTableName().trim().isEmpty()) {

            if (restaurantTableRepository.existsByTableNameAndTableIdNot(
                    request.getTableName().trim(),
                    tableId)) {

                throw new BadRequestException(
                        "Table name already exists.");
            }

            table.setTableName(request.getTableName().trim());
        }

        if (request.getSeatCapacity() != null) {
            table.setSeatCapacity(request.getSeatCapacity());
        }

        restaurantTableRepository.save(table);

        return ResponseHandler.updated(
                "Table updated successfully.",
                null
        );
    }

    @Override
    @Transactional
    public ResponseEntity<ApiResponse<Object>> deleteTable(Integer tableId) {

        RestaurantTable table = getActiveTable(tableId);

        table.setIsActive(false);

        restaurantTableRepository.save(table);

        return ResponseHandler.updated(
                "Table deleted successfully.",
                null
        );
    }

    private RestaurantTable getActiveTable(Integer tableId) {

        RestaurantTable table = restaurantTableRepository
                .findByTableId(tableId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Table not found."));

        if (!Boolean.TRUE.equals(table.getIsActive())) {
            throw new BadRequestException("Table is inactive.");
        }

        return table;
    }
}