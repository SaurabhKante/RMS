package com.rms.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    private Boolean SUCCESS;

    private String MESSAGE;

    private T DATA;

    private Object PAGINATION;

    private Long COUNT;

}