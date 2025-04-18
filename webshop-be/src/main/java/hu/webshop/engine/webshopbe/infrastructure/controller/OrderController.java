package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.domain.order.model.OrderPage;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSortType;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSpecificationArgs;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;
import hu.webshop.engine.webshopbe.infrastructure.adapter.OrderAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Admin;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.User;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.OrderStatusRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.RefundOrderItemRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CsvResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.OrderResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.PaymentIntentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(
        name = "Order service",
        description = "REST endpoints for order service"
)
public class OrderController {

    private final OrderAdapter orderAdapter;

    @Operation(
            tags = {"Order service"},
            summary = "Get all orders",
            description = "Admin can get all orders"
    )
    @GetMapping(value = ApiPaths.Orders.BASE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Admin
    public ResponseEntity<OrderPage<OrderResponse>> getAll(
            @RequestParam(required = false) LocalDate minDate,
            @RequestParam(required = false) LocalDate maxDate,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) List<PaymentMethod> paymentMethods,
            @RequestParam(required = false) List<OrderStatus> statuses,
            @RequestParam(required = false) OrderSortType sortType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        log.info("getAll");
        return ResponseEntity.ok(orderAdapter.getAll(new OrderSpecificationArgs(minDate, maxDate, minPrice, maxPrice, paymentMethods, statuses), sortType, page, size));
    }

    @Operation(
            tags = {"Order service"},
            summary = "Create an order",
            description = "Users can create an order"
    )
    @PostMapping(value = ApiPaths.Orders.MY_BASE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<OrderResponse> create() {
        log.info("create");
        return ResponseEntity.status(HttpStatus.CREATED).body(orderAdapter.create(PaymentMethod.STRIPE));
    }

    @Operation(
            tags = {"Order service"},
            summary = "Get current user's orders",
            description = "Users can get their own orders"
    )
    @GetMapping(value = ApiPaths.Orders.MY_BASE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        log.info("getMyOrders");
        return ResponseEntity.ok(orderAdapter.getUserOrders());
    }

    @Operation(
            tags = {"Order service"},
            summary = "Pay an order",
            description = "Users can pay an order"
    )
    @PostMapping(value = ApiPaths.Orders.PAYMENT_INTENT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<PaymentIntentResponse> paymentIntent(@PathVariable UUID id) {
        log.info("paymentIntent > id: [{}]", id);
        return ResponseEntity.ok(orderAdapter.paymentIntent(id));
    }

    @Operation(
            tags = {"Order service"},
            summary = "Update order status",
            description = "Admins can update order status"
    )
    @PostMapping(value = ApiPaths.Orders.CHANGE_STATUS,
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @Admin
    public ResponseEntity<OrderResponse> changeOrderStatus(@PathVariable UUID id, @RequestBody OrderStatusRequest request) {
        log.info("changeOrderStatus > id: [{}], request: [{}]", id, request);
        return ResponseEntity.ok(orderAdapter.changeStatus(id, request));
    }

    @Operation(
            tags = {"Order service"},
            summary = "Cancel an order",
            description = "Users can cancel an order"
    )
    @PostMapping(ApiPaths.Orders.CANCEL)
    @User
    public ResponseEntity<OrderResponse> cancel(@PathVariable UUID id) {
        log.info("cancel > id: [{}]", id);
        return ResponseEntity.ok().body(orderAdapter.cancel(id));
    }

    @Operation(
            tags = {"Order service"},
            summary = "Return order items",
            description = "Users can return order items"
    )
    @PostMapping(ApiPaths.Orders.RETURN)
    @User
    public ResponseEntity<OrderResponse> returnOrder(@PathVariable UUID id) {
        log.info("returnOrder > id: [{}]", id);
        return ResponseEntity.ok().body(orderAdapter.returnOrder(id));
    }

    @Operation(
            tags = {"Order service"},
            summary = "Admin can refund order items",
            description = "Admin can refund order items"
    )
    @PostMapping(value = ApiPaths.Orders.REFUND,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)

    @Admin
    public ResponseEntity<OrderResponse> createRefund(@PathVariable UUID id, @RequestBody List<@Valid RefundOrderItemRequest> refundRequest) {
        log.info("createRefund > id: [{}], refundRequest: [{}]", id, refundRequest);
        return ResponseEntity.ok().body(orderAdapter.createRefund(id, refundRequest));
    }

    @Operation(
            tags = {"Order service"},
            summary = "Export orders from a csv",
            description = "Export orders from a base64 encoded csv"
    )
    @GetMapping(value = ApiPaths.Orders.EXPORT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Admin
    public ResponseEntity<CsvResponse> export(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to
    ) {
        log.info("export > from: [{}], to: [{}]", from, to);
        return ResponseEntity.ok().body(orderAdapter.export(from, to));
    }

}
