package com.grosserystore.grosserystore.controller;

import com.grosserystore.grosserystore.dto.OrderDetailDto;
import com.grosserystore.grosserystore.dto.OrderItemDto;
import com.grosserystore.grosserystore.dto.OrderSummaryDto;
import com.grosserystore.grosserystore.entity.Order;
import com.grosserystore.grosserystore.service.OrderService;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/{userId}/checkout")
    public ResponseEntity<Order> checkout(@PathVariable Long userId) {
        Order order = orderService.createOrderFromCart(userId);
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{userId}")
    public List<Order> getOrderHistory(@PathVariable Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    // @GetMapping("/order/{orderId}")
    // public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
    //     Order order = orderService.getOrderById(orderId);
    //     if (order != null) {
    //         return ResponseEntity.ok(order);
    //     }
    //     return ResponseEntity.notFound().build();
    // }
    @GetMapping("/order/{orderId}")
    public ResponseEntity<OrderDetailDto> getOrderById(@PathVariable Long orderId) {
        Order o = orderService.getOrderWithItems(orderId);
        if (o == null) {
            return ResponseEntity.notFound().build();
        }

        var items = o.getOrderItems().stream().map(oi
                -> new OrderItemDto(
                        oi.getId(),
                        oi.getProduct().getName(),
                        oi.getQuantity(),
                        oi.getPrice(),
                        oi.getPrice().multiply(java.math.BigDecimal.valueOf(oi.getQuantity()))
                )
        ).toList();

        return ResponseEntity.ok(new OrderDetailDto(
                o.getId(),
                o.getStatus() != null ? o.getStatus().name() : "PENDING",
                o.getTotalAmount(),
                items
        ));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        try {
            Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
            Order updated = orderService.updateOrderStatus(orderId, orderStatus);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.notFound().build();
    }
}
