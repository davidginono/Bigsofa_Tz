package com.bigsofa.backend.admin;

import java.util.List;
import java.util.Optional;

import com.bigsofa.backend.dto.OrderResponse;
import com.bigsofa.backend.dto.UpdateOrderStatusRequest;
import com.bigsofa.backend.model.OrderStatus;
import com.bigsofa.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final AdminAuthService authService;
    private final OrderService orderService;

    public AdminOrderController(AdminAuthService authService, OrderService orderService) {
        this.authService = authService;
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> listOrders(@RequestHeader("X-Admin-Token") String token,
                                          @RequestParam(name = "status", required = false) OrderStatus status) {
        authService.requireValidToken(token);
        return orderService.listOrders(Optional.ofNullable(status)).stream()
                .map(OrderResponse::fromEntity)
                .toList();
    }

    @PatchMapping("/{id}")
    public OrderResponse updateStatus(@RequestHeader("X-Admin-Token") String token,
                                      @PathVariable Long id,
                                      @Valid @RequestBody UpdateOrderStatusRequest request) {
        authService.requireValidToken(token);
        return OrderResponse.fromEntity(orderService.updateStatus(id, request.status()));
    }
}

