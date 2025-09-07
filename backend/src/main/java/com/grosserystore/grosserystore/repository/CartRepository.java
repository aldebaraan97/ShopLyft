package com.grosserystore.grosserystore.repository;

import com.grosserystore.grosserystore.entity.Cart;
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
public interface CartRepository extends JpaRepository<Cart, Long> {

    Optional<Cart> findByUserId(Long userId);

    // Row lock the Cart when we mutate its items; keeps your current DDL intact
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints(
            @QueryHint(name = "jakarta.persistence.lock.timeout", value = "3000"))
    @Query("select c from Cart c where c.user.id = :userId")
    Optional<Cart> findByUserIdForUpdate(@Param("userId") Long userId);
}
