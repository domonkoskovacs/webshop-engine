package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.order.OrderCreationService;
import hu.webshop.engine.webshopbe.domain.order.OrderPaymentService;
import hu.webshop.engine.webshopbe.domain.order.OrderQueryService;
import hu.webshop.engine.webshopbe.domain.order.OrderStatusService;
import hu.webshop.engine.webshopbe.domain.order.filters.OrderSorting;
import hu.webshop.engine.webshopbe.domain.order.model.OrderPage;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSortType;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSpecificationArgs;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.OrderMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.OrderStatusRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.RefundOrderItemRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CsvResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.OrderResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.PaymentIntentResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderAdapter {

    private final OrderStatusService orderStatusService;
    private final OrderPaymentService orderPaymentService;
    private final OrderCreationService orderCreationService;
    private final OrderQueryService orderQueryService;
    private final OrderMapper orderMapper;

    public OrderPage<OrderResponse> getAll(
            OrderSpecificationArgs args,
            OrderSortType sortType,
            int page,
            int size
    ) {
        log.info("getAll");
        PageRequest pageRequest = sortType != null ? PageRequest.of(page, size, OrderSorting.sort(sortType)) : PageRequest.of(page, size);
        return orderQueryService.getAll(args, pageRequest).map(orderMapper::toResponse);
    }

    public OrderResponse create(PaymentMethod paymentMethod) {
        log.info("create > paymentMethod: [{}]", paymentMethod);
        return orderMapper.toResponse(orderCreationService.create(paymentMethod));
    }

    public PaymentIntentResponse paymentIntent(UUID id) {
        log.info("createPaymentIntent > id: [{}]", id);
        return new PaymentIntentResponse(orderPaymentService.paymentIntent(id).getClientSecret());
    }

    public OrderResponse changeStatus(UUID id, OrderStatusRequest request) {
        log.info("changeStatus > id: [{}], request: [{}]", id, request);
        return orderMapper.toResponse(orderStatusService.changeStatus(id, request.orderStatus()));
    }

    public OrderResponse cancel(UUID id) {
        log.info("cancel > id: [{}]", id);
        return orderMapper.toResponse(orderStatusService.cancel(id));
    }

    public CsvResponse export(LocalDate from, LocalDate to) {
        log.info("export > from: [{}], to: [{}]", from, to);
        return new CsvResponse(orderQueryService.export(from, to));
    }

    public OrderResponse returnOrder(UUID id) {
        log.info("returnOrder > id: [{}]", id);
        return orderMapper.toResponse(orderStatusService.returnOrder(id));
    }

    public OrderResponse createRefund(UUID id, List<@Valid RefundOrderItemRequest> refundRequest) {
        log.info("createRefund > id: [{}], refundRequest: [{}]", id, refundRequest);
        return orderMapper.toResponse(orderStatusService.createRefund(id, orderMapper.fromRequestlist(refundRequest)));
    }

    public List<OrderResponse> getUserOrders() {
        return orderMapper.toResponseList(orderQueryService.getOrdersFromCurrentUser());
    }
}
