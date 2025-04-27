package hu.webshop.engine.webshopbe.domain.order.filters;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSpecificationArgs;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentType;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class OrderSpecification {

    public static Specification<Order> getSpecifications(
            OrderSpecificationArgs args) {
        return Specification.where(paymentType(args.paymentTypes()))
                .and(status(args.statuses()))
                .and(minTotalPrice(args.minPrice()))
                .and(maxTotalPrice(args.maxPrice()))
                .and(minDate(args.minDate()))
                .and(maxDate(args.maxDate()));
    }

    public static Specification<Order> getSpecificationsWithoutPrice(
            OrderSpecificationArgs args) {
        return Specification.where(paymentType(args.paymentTypes()))
                .and(status(args.statuses()))
                .and(minDate(args.minDate()))
                .and(maxDate(args.maxDate()));
    }

    private static Specification<Order> paymentType(List<PaymentType> paymentTypes) {
        return (orders, cq, cb) -> {
            if (paymentTypes == null || paymentTypes.isEmpty()) return cb.conjunction();
            return orders.get("paymentMethod").in(paymentTypes);
        };
    }

    private static Specification<Order> status(List<OrderStatus> paymentMethods) {
        return (orders, cq, cb) -> {
            if (paymentMethods == null || paymentMethods.isEmpty()) return cb.conjunction();
            return orders.get("status").in(paymentMethods);
        };
    }

    private static Specification<Order> minTotalPrice(Double price) {
        return (orders, cq, cb) -> {
            if (price == null) return cb.conjunction();
            return cb.greaterThanOrEqualTo(orders.get("totalPrice"), price);
        };
    }

    private static Specification<Order> maxTotalPrice(Double price) {
        return (orders, cq, cb) -> {
            if (price == null) return cb.conjunction();
            return cb.lessThanOrEqualTo(orders.get("totalPrice"), price);
        };
    }

    private static Specification<Order> minDate(LocalDate date) {
        return (orders, cq, cb) -> {
            if (date == null) return cb.conjunction();
            return cb.greaterThanOrEqualTo(orders.get("orderDate"), date);
        };
    }

    private static Specification<Order> maxDate(LocalDate date) {
        return (orders, cq, cb) -> {
            if (date == null) return cb.conjunction();
            return cb.lessThanOrEqualTo(orders.get("orderDate"), date);
        };
    }
}
