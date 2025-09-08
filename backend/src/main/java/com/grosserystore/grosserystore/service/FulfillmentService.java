package com.grosserystore.grosserystore.service;

import com.grosserystore.grosserystore.entity.Order;
import com.grosserystore.grosserystore.repository.CartRepository;
import com.grosserystore.grosserystore.repository.OrderRepository;
import com.grosserystore.grosserystore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FulfillmentService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

    @Transactional
    public void markPaidDecrementStockAndClearCart(Long orderId, Long userId) {
        var order = orderRepository.findByIdFetchItems(orderId)
                .orElseThrow(() -> new IllegalStateException("Order not found: " + orderId));

        if (order.getStatus() == Order.OrderStatus.CONFIRMED) {
            return;
        }

        order.getOrderItems().forEach(oi -> {
            int updated = productRepository.decrementStock(oi.getProduct().getId(), oi.getQuantity());
            if (updated == 0) {
                throw new IllegalStateException(
                        "Insufficient stock for product " + oi.getProduct().getId());
            }
        });

        order.setStatus(Order.OrderStatus.CONFIRMED);
        orderRepository.save(order);

        var cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }
}
