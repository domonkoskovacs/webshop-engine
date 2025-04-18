package hu.webshop.engine.webshopbe.domain.store.entity;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "store")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Store extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "min_order_price", nullable = false)
    private Double minOrderPrice;

    @Column(name = "shipping_price", nullable = false)
    private Double shippingPrice;

    @Column(name = "return_period", nullable = false)
    private Integer returnPeriod;

    @Column(name = "unpaid_order_cancel_hours", nullable = false)
    private Integer unpaidOrderCancelHours;

    @Builder.Default
    @Column(name = "delete_out_of_stock_products", nullable = false)
    private Boolean deleteOutOfStockProducts = Boolean.FALSE;

    @Builder.Default
    @Column(name = "enable_built_in_marketing_emails", nullable = false)
    private Boolean enableBuiltInMarketingEmails = Boolean.FALSE;

}
