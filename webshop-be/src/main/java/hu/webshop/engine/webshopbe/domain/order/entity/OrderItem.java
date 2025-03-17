package hu.webshop.engine.webshopbe.domain.order.entity;


import java.util.UUID;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import hu.webshop.engine.webshopbe.domain.product.value.Gender;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_item")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem extends BaseEntity {

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "individual_price", nullable = false)
    private Double individualPrice;

    @Column(name = "thumbnail_url")
    private String thumbNailUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "subcategory_name", nullable = false)
    private String subcategoryName;

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(name = "count", nullable = false)
    private Integer count;
}
