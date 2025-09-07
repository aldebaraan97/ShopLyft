package com.grosserystore.grosserystore.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class QuantityRequest {

    // 0 means "remove item"
    @NotNull
    @Min(0)
    private Integer quantity;
}
