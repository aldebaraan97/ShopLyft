package com.grosserystore.grosserystore.repository;

import com.grosserystore.grosserystore.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    @org.springframework.data.jpa.repository.Query("""
    select o
    from Order o
    left join fetch o.orderItems oi
    left join fetch oi.product p
    where o.id = :id
    """)
    java.util.Optional<com.grosserystore.grosserystore.entity.Order> findByIdFetchItems(
            @org.springframework.data.repository.query.Param("id") Long id
    );
}
