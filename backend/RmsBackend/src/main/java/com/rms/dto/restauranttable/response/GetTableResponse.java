package com.rms.dto.restauranttable.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GetTableResponse {
    private Integer tableId;
    private String tableName;
    private Integer seatCapacity;
}
