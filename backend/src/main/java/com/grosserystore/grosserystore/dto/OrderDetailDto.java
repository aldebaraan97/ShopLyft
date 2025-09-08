package com.grosserystore.grosserystore.dto;

import java.math.BigDecimal;
import java.util.List;

public record OrderDetailDto(
        Long id,
        String status,
        BigDecimal totalAmount,
        List<OrderItemDto> items
        ) {

}
