package com.grosserystore.grosserystore.controller;

import com.grosserystore.grosserystore.dto.CartItemRequest;
import com.grosserystore.grosserystore.dto.QuantityRequest;
import com.grosserystore.grosserystore.entity.Cart;
import com.grosserystore.grosserystore.service.CartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Carts", description = "Cart management APIs")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable @Positive Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return (cart != null) ? ResponseEntity.ok(cart) : ResponseEntity.notFound().build();
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<Cart> addItem(
            @PathVariable @Positive Long userId,
            @Valid @RequestBody CartItemRequest request) {
        Cart cart = cartService.addItemToCart(userId, request.getProductId(), request.getQuantity());
        if (cart == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.created(URI.create("/api/cart/" + userId)).body(cart);
    }

    // ✅ Single update endpoint: body only needs quantity
    @PutMapping("/{userId}/items/{productId}")
    public ResponseEntity<Cart> updateItem(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long productId,
            @Valid @RequestBody QuantityRequest request) {
        Cart cart = cartService.updateItemQuantity(userId, productId, request.getQuantity());
        return (cart != null) ? ResponseEntity.ok(cart) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<Void> removeItem(
            @PathVariable @Positive Long userId,
            @PathVariable @Positive Long productId) {
        Cart cart = cartService.removeItemFromCart(userId, productId);
        return (cart != null) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable @Positive Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
