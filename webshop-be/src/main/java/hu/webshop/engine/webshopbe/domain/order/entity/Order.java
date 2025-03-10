package hu.webshop.engine.webshopbe.domain.order.entity;

import java.time.OffsetDateTime;
import java.util.List;

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

    @Column(name = "order_date", nullable = false)
    private OffsetDateTime orderDate;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "payment_method", nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Column(name = "order_status")
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(name = "payment_intent_id")
    private String paymentIntentId;

    @Column(name = "refund_id")
    private String refundId;

    @Column(name = "paid_date")
    private OffsetDateTime paidDate;

    @Column(name = "refunded_date")
    private OffsetDateTime refundedDate;

    @ManyToOne()
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "order_id", nullable = false)
    private List<OrderItem> products;

    public List<ProductDetails> getProductDetails() {
        if (products == null || products.isEmpty())
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, "order can't be empty");
        return products.stream().map(orderItem -> new ProductDetails(
                orderItem.getProduct().getName(), orderItem.getCount(), orderItem.getProduct().getPrice() * orderItem.getCount()
        )).toList();
    }
}
