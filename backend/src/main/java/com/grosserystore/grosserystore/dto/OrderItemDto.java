package com.grosserystore.grosserystore.dto;

import java.math.BigDecimal;

public record OrderItemDto(
        Long id,
        String productName,
        int quantity,
        BigDecimal price,
        BigDecimal subtotal
        ) {

}
