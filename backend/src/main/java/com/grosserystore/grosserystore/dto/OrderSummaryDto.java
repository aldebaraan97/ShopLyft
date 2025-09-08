// src/main/java/com/grosserystore/grosserystore/dto/OrderSummaryDto.java
package com.grosserystore.grosserystore.dto;

import java.math.BigDecimal;

public record OrderSummaryDto(Long id, String status, BigDecimal totalAmount) {

}
