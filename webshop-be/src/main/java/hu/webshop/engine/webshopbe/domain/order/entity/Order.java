package hu.webshop.engine.webshopbe.domain.order.entity;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;
import hu.webshop.engine.webshopbe.domain.order.value.ProductDetails;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "webshop_order")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order extends BaseEntity {

    @Builder.Default
    @Column(name = "order_date", nullable = false)
    private OffsetDateTime orderDate = OffsetDateTime.now();

    @Builder.Default
    @Column(name = "order_number", nullable = false, unique = true, updatable = false)
    private String orderNumber = generateOrderNumber();

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "shipping_price", nullable = false)
    private Double shippingPrice;

    @Column(name = "payment_method", nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Builder.Default
    @Column(name = "order_status")
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.CREATED;

    @Column(name = "payment_intent_id")
    private String paymentIntentId;

    @Column(name = "refund_id")
    private String refundId;

    @Column(name = "paid_date")
    private OffsetDateTime paidDate;

    @Column(name = "refunded_date")
    private OffsetDateTime refundedDate;

    @Column(name = "delivered_date")
    private OffsetDateTime deliveredDate;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "order_id", nullable = false)
    private List<OrderItem> items = new ArrayList<>();

    public void setStatus(OrderStatus status) {
        if (!this.status.isNewStatusApplicable(status)) {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, status + " is not applicable to current status: " + this.status);
        }
        this.status = status;
    }

    private static String generateOrderNumber() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        String uuidSegment = UUID.randomUUID().toString().split("-")[0].toUpperCase();
        return "ORD-" + timestamp + "-" + uuidSegment;
    }

    public List<ProductDetails> getProductDetails() {
        return items.stream().map(orderItem -> new ProductDetails(
                orderItem.getProductName(), orderItem.getCount(), orderItem.getIndividualPrice() * orderItem.getCount()
        )).toList();
    }
}
