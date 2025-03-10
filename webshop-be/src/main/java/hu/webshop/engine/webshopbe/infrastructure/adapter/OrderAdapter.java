package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.order.OrderService;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSortType;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSpecificationArgs;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.OrderMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.OrderStatusRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CsvResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.OrderResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.PaymentIntentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderAdapter {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    public Page<OrderResponse> getAll(
            OrderSpecificationArgs args,
            OrderSortType sortType,
            int page,
            int size
    ) {
        log.info("getAll");
        return orderService.getAll(args, sortType, page, size).map(orderMapper::toResponse);
    }

    public OrderResponse getById(UUID id) {
        log.info("getById > id: [{}]", id);
        return orderMapper.toResponse(orderService.getById(id));
    }

    public OrderResponse create(PaymentMethod paymentMethod) {
        log.info("create > paymentMethod: [{}]", paymentMethod);
        return orderMapper.toResponse(orderService.create(paymentMethod));
    }

    public PaymentIntentResponse createPaymentIntent(UUID id) {
        log.info("createPaymentIntent > id: [{}]", id);
        return new PaymentIntentResponse(orderService.createPaymentIntent(id).getClientSecret());
    }

    public OrderResponse changeStatus(UUID id, OrderStatusRequest request) {
        log.info("changeStatus > id: [{}], request: [{}]", id, request);
        return orderMapper.toResponse(orderService.changeStatus(id, request.orderStatus()));
    }

    public OrderResponse cancel(UUID id) {
        log.info("cancel > id: [{}]", id);
        return orderMapper.toResponse(orderService.cancel(id));
    }

    public CsvResponse export(LocalDate from, LocalDate to) {
        log.info("export > from: [{}], to: [{}]", from, to);
        return new CsvResponse(orderService.export(from, to));
    }
}
