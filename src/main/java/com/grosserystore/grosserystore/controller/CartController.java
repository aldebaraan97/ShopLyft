package com.grosserystore.grosserystore.controller;

import com.grosserystore.grosserystore.dto.CartItemRequest;
import com.grosserystore.grosserystore.entity.Cart;
import com.grosserystore.grosserystore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        if (cart != null) {
            return ResponseEntity.ok(cart);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<Cart> addItem(
            @PathVariable Long userId,
            @RequestBody CartItemRequest request) {
        Cart cart = cartService.addItemToCart(userId, request.getProductId(), request.getQuantity());
        if (cart != null) {
            return ResponseEntity.ok(cart);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{userId}/items/{productId}")
    public ResponseEntity<Cart> updateItem(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @RequestBody CartItemRequest request) {
        Cart cart = cartService.updateItemQuantity(userId, productId, request.getQuantity());
        if (cart != null) {
            return ResponseEntity.ok(cart);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{userId}/items/{productId}")
    public ResponseEntity<Cart> removeItem(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        Cart cart = cartService.removeItemFromCart(userId, productId);
        if (cart != null) {
            return ResponseEntity.ok(cart);
        }
        return ResponseEntity.notFound().build();
    }
}