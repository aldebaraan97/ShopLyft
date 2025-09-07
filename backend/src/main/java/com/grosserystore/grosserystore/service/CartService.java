package com.grosserystore.grosserystore.service;

import com.grosserystore.grosserystore.entity.Cart;
import com.grosserystore.grosserystore.entity.CartItem;
import com.grosserystore.grosserystore.entity.Product;
import com.grosserystore.grosserystore.repository.CartItemRepository;
import com.grosserystore.grosserystore.repository.CartRepository;
import com.grosserystore.grosserystore.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId).orElse(null);
    }

    @Transactional
    public Cart addItemToCart(Long userId, Long productId, Integer quantity) {
        if (userId == null || productId == null || quantity == null || quantity <= 0) {
            return null;
        }

        // Lock the cart row to serialize concurrent mutations (no schema change needed)
        Cart cart = cartRepository.findByUserIdForUpdate(userId).orElse(null);
        if (cart == null) {
            return null;
        }

        Product product = productRepository.findById(productId).orElse(null);
        if (product == null /* || !product.isActive() */) {
            return null;
        }

        // Try to find line with a lock
        CartItem item = cartItemRepository
                .findByCartIdAndProductIdForUpdate(cart.getId(), productId)
                .orElse(null);

        if (item != null) {
            int newQty = (item.getQuantity() == null ? 0 : item.getQuantity()) + quantity;
            if (newQty <= 0) {
                cart.getItems().remove(item);
            } else {
                item.setQuantity(newQty);
            }
            return cartRepository.save(cart);
        }

        // Create new line
        CartItem newItem = new CartItem();
        newItem.setCart(cart);
        newItem.setProduct(product);
        newItem.setQuantity(quantity);
        cart.getItems().add(newItem);

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateItemQuantity(Long userId, Long productId, Integer quantity) {
        if (userId == null || productId == null || quantity == null) {
            return null;
        }

        // Lock the cart while mutating
        Cart cart = cartRepository.findByUserIdForUpdate(userId).orElse(null);
        if (cart == null) {
            return null;
        }

        CartItem item = cartItemRepository
                .findByCartIdAndProductIdForUpdate(cart.getId(), productId)
                .orElse(null);

        if (item == null) {
            return null; // controller can 404
        }
        if (quantity <= 0) {
            cart.getItems().remove(item); // orphanRemoval deletes row
        } else {
            item.setQuantity(quantity);
        }
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItemFromCart(Long userId, Long productId) {
        return updateItemQuantity(userId, productId, 0);
    }

    @Transactional
    public void clearCart(Long userId) {
        // Lock to serialize clears vs other mutations
        Cart cart = cartRepository.findByUserIdForUpdate(userId).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }
}
