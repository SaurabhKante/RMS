package com.rms.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseHandler {

    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T data) {

        ApiResponse<T> response = ApiResponse.<T>builder()
                .SUCCESS(true)
                .MESSAGE(message)
                .DATA(data)
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(
            String message,
            T data,
            Object pagination,
            Long count) {

        ApiResponse<T> response = ApiResponse.<T>builder()
                .SUCCESS(true)
                .MESSAGE(message)
                .DATA(data)
                .PAGINATION(pagination)
                .COUNT(count)
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(
            String message,
            T data) {

        ApiResponse<T> response = ApiResponse.<T>builder()
                .SUCCESS(true)
                .MESSAGE(message)
                .DATA(data)
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    public static <T> ResponseEntity<ApiResponse<T>> updated(
            String message,
            T data) {

        ApiResponse<T> response = ApiResponse.<T>builder()
                .SUCCESS(true)
                .MESSAGE(message)
                .DATA(data)
                .build();

        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
    }

    public static ResponseEntity<ApiResponse<Object>> failure(
            HttpStatus status,
            String message,
            Object error) {

        ApiResponse<Object> response = ApiResponse.builder()
                .SUCCESS(false)
                .MESSAGE(message)
                .DATA(error)
                .build();

        return new ResponseEntity<>(response, status);
    }

    public static ResponseEntity<ApiResponse<Object>> unauthorized(
            String message,
            Object error) {

        ApiResponse<Object> response = ApiResponse.builder()
                .SUCCESS(false)
                .MESSAGE(message)
                .DATA(error)
                .build();

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    public static ResponseEntity<ApiResponse<Object>> validationFailed(
            String message,
            Object error) {

        ApiResponse<Object> response = ApiResponse.builder()
                .SUCCESS(false)
                .MESSAGE(message)
                .DATA(error)
                .build();

        return new ResponseEntity<>(response, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}