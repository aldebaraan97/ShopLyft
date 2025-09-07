package com.grosserystore.grosserystore.repository;

import com.grosserystore.grosserystore.entity.CartItem;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Plain lookup (no lock)
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    // Locked lookup for mutations (does NOT change your schema)
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(
            @QueryHint(name = "jakarta.persistence.lock.timeout", value = "3000"))
    @Query("select ci from CartItem ci where ci.cart.id = :cartId and ci.product.id = :productId")
    Optional<CartItem> findByCartIdAndProductIdForUpdate(@Param("cartId") Long cartId,
            @Param("productId") Long productId);
}
