package com.bigsofa.backend.repository;

import java.util.List;

import com.bigsofa.backend.model.CustomerOrder;
import com.bigsofa.backend.model.OrderStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {

    @EntityGraph(attributePaths = {"items", "items.furnitureItem"})
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"items", "items.furnitureItem"})
    List<CustomerOrder> findAllByStatusOrderByCreatedAtDesc(OrderStatus status);
}

