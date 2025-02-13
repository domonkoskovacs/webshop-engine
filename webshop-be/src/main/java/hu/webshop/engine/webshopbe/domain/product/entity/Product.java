package hu.webshop.engine.webshopbe.domain.product.entity;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product extends BaseEntity {

    @JoinColumn(name = "brand_id", nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private Brand brand;

    @Column(name = "product_name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @JoinColumn(name = "sub_category_id", nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private SubCategory subCategory;

    @Column(name = "product_type", nullable = false)
    private String type;

    @Column(name = "count", nullable = false)
    private Integer count;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "discount_percentage")
    private Double discountPercentage;

    @Column(name = "image_url_list")
    private String imageUrls;

    @Column(name = "item_number")
    private String itemNumber;

    public String getFullProductName() {
        String separator = " ";
        return getBrand().getName() +
                separator +
                getName() +
                separator;
    }
}
