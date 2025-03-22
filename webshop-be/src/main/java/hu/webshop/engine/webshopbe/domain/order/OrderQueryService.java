package hu.webshop.engine.webshopbe.domain.order;

import static hu.webshop.engine.webshopbe.domain.order.filters.OrderSpecification.getSpecifications;
import static hu.webshop.engine.webshopbe.domain.order.filters.OrderSpecification.getSpecificationsWithoutPrice;
import static hu.webshop.engine.webshopbe.domain.util.CSVWriter.formatDate;
import static hu.webshop.engine.webshopbe.domain.util.CSVWriter.valueOfNullable;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.model.OrderPage;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSpecificationArgs;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.util.CSVWriter;
import hu.webshop.engine.webshopbe.domain.util.TimeUtil;
import hu.webshop.engine.webshopbe.domain.util.value.DateBetween;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderQueryService {

    private final OrderRepository orderRepository;
    private final UserService userService;

    public OrderPage<Order> getAll(
            OrderSpecificationArgs args,
            PageRequest pageRequest
    ) {
        log.info("getAll > args: [{}], pageRequest: [{}]", args, pageRequest);
        Specification<Order> spec = getSpecifications(args);
        Page<Order> orders = orderRepository.findAll(spec, pageRequest);
        List<Order> ordersWithoutPriceFilter = orderRepository.findAll(getSpecificationsWithoutPrice(args));
        Double minPrice = ordersWithoutPriceFilter.stream().map(Order::getTotalPrice).min(Double::compareTo).orElse(0d);
        Double maxPrice = ordersWithoutPriceFilter.stream().map(Order::getTotalPrice).max(Double::compareTo).orElse(0d);
        return new OrderPage<>(orders.getContent(), pageRequest, orders.getTotalElements(), minPrice, maxPrice);
    }

    public Order getById(UUID id) {
        log.info("getById > id: [{}]", id);
        return orderRepository.findById(id).orElseThrow(this::entityNotFoundException);
    }

    private EntityNotFoundException entityNotFoundException() {
        return new EntityNotFoundException("Order was not found");
    }

    public Order getOrderFromCurrentUser(UUID id) {
        return userService.getCurrentUser().getOrders().stream()
                .filter(o -> o.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new OrderException(ReasonCode.ORDER_EXCEPTION, "No order present for the user with the given id"));
    }

    public List<Order> getAllBetween(LocalDate from, LocalDate to) {
        return orderRepository.findAllByOrderDateGreaterThanEqualAndOrderDateLessThan(
                OffsetDateTime.of(from, LocalTime.MIDNIGHT, ZoneOffset.UTC),
                OffsetDateTime.of(to, LocalTime.MIDNIGHT, ZoneOffset.UTC)
        );
    }

    /**
     * exports orders as a csv within the given time period
     *
     * @return csv string
     */
    public String export(LocalDate from, LocalDate to) {
        log.info("export > from: [{}], to: [{}]", from, to);
        DateBetween dateBetween = TimeUtil.validateAndSetDateBetween(from, to);
        List<Order> exportData = getAllBetween(dateBetween.from(), dateBetween.to());
        String[] header = {"OrderDate", "OrderNumber", "TotalPrice", "ShippingPrice", "PaymentMethod", "Status", "PaymentIntentId", "RefundId", "PaidDate", "RefundedDate", "UserName", "ItemCount"};
        List<Function<Order, ?>> columnExtractors = List.of(
                order -> formatDate(order.getOrderDate()),
                Order::getOrderNumber,
                Order::getTotalPrice,
                Order::getShippingPrice,
                order -> valueOfNullable(order.getPaymentMethod(), PaymentMethod::name),
                order -> valueOfNullable(order.getStatus(), OrderStatus::name),
                Order::getPaymentIntentId,
                Order::getRefundId,
                Order::getPaidDate,
                Order::getRefundedDate,
                order -> valueOfNullable(order.getUser(), User::getFullName),
                order -> valueOfNullable(order.getItems(), List::size)
        );
        return new CSVWriter<>(
                exportData,
                header,
                columnExtractors
        ).base64().asString();
    }
}
