package com.bigsofa.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.bigsofa.backend.dto.CreateOrderRequest;
import com.bigsofa.backend.dto.OrderItemRequest;
import com.bigsofa.backend.model.CustomerOrder;
import com.bigsofa.backend.model.FurnitureItem;
import com.bigsofa.backend.model.OrderItem;
import com.bigsofa.backend.model.OrderStatus;
import com.bigsofa.backend.repository.CustomerOrderRepository;
import com.bigsofa.backend.repository.FurnitureItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class OrderService {

    private final CustomerOrderRepository orderRepository;
    private final FurnitureItemRepository furnitureItemRepository;

    public OrderService(CustomerOrderRepository orderRepository,
                        FurnitureItemRepository furnitureItemRepository) {
        this.orderRepository = orderRepository;
        this.furnitureItemRepository = furnitureItemRepository;
    }

    @Transactional
    public CustomerOrder createOrder(CreateOrderRequest request) {
        if (CollectionUtils.isEmpty(request.items())) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        CustomerOrder order = new CustomerOrder();
        order.setCustomerName(request.customerName());
        order.setEmail(request.email());
        order.setPhone(request.phone());
        order.setAddressLine1(request.addressLine1());
        order.setAddressLine2(request.addressLine2());
        order.setCity(request.city());
        order.setStatus(OrderStatus.PENDING);

        Map<Long, Integer> aggregatedQuantities = aggregateQuantities(request.items());
        int totalCents = 0;

        for (Map.Entry<Long, Integer> entry : aggregatedQuantities.entrySet()) {
            FurnitureItem item = furnitureItemRepository.findById(entry.getKey())
                    .orElseThrow(() -> new IllegalArgumentException("Furniture item not found: " + entry.getKey()));
            int quantity = entry.getValue();
            if (quantity <= 0) {
                throw new IllegalArgumentException("Quantity must be positive for item " + item.getId());
            }
            OrderItem orderItem = new OrderItem();
            orderItem.setFurnitureItem(item);
            orderItem.setItemName(item.getName());
            orderItem.setPriceCents(item.getPriceCents());
            orderItem.setQuantity(quantity);

            order.addItem(orderItem);
            if (item.getPriceCents() != null) {
                totalCents += item.getPriceCents() * quantity;
            }
        }

        order.setTotalCents(totalCents);
        return orderRepository.save(order);
    }

    @Transactional
    public CustomerOrder updateStatus(Long orderId, OrderStatus status) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        order.setStatus(status);
        return order;
    }

    @Transactional
    public CustomerOrder getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
    }

    @Transactional
    public List<CustomerOrder> listOrders(Optional<OrderStatus> status) {
        if (status.isPresent()) {
            return orderRepository.findAllByStatusOrderByCreatedAtDesc(status.get());
        }
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    private Map<Long, Integer> aggregateQuantities(List<OrderItemRequest> requests) {
        Map<Long, Integer> aggregated = new HashMap<>();
        for (OrderItemRequest item : requests) {
            aggregated.merge(item.furnitureItemId(), item.quantity(), Integer::sum);
        }
        return aggregated;
    }
}
