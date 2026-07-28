package com.rms.service;

import com.rms.dto.restauranttable.request.AddTableRequest;
import com.rms.dto.restauranttable.request.UpdateTableRequest;
import com.rms.util.ApiResponse;
import org.springframework.http.ResponseEntity;

public interface RestaurantTableService {
    ResponseEntity<ApiResponse<Object>> addTable(AddTableRequest request);
    ResponseEntity<ApiResponse<Object>> getTableById(Integer tableId);
    ResponseEntity<ApiResponse<Object>> getAllTables();
    ResponseEntity<ApiResponse<Object>> updateTable(Integer tableId, UpdateTableRequest request);
    ResponseEntity<ApiResponse<Object>> deleteTable(Integer tableId);

}
