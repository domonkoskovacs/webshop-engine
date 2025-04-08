package hu.webshop.engine.webshopbe.domain.product.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.product.value.Gender;
import hu.webshop.engine.webshopbe.domain.util.Constants;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "count", nullable = false)
    private Integer count;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "discount_percentage", nullable = false)
    private Double discountPercentage;

    @Builder.Default
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "product_id")
    private List<ImageMetadata> images = new ArrayList<>();

    @Column(name = "item_number", nullable = false)
    private String itemNumber;

    public String getThumbNailUrl() {
        return images.isEmpty() ? null : images.get(0).getUrl();
    }

    public String getExportImageUrls() {
        return images.stream()
                .map(ImageMetadata::getUrl)
                .collect(Collectors.joining(Constants.IMAGE_URL_SEPARATOR));
    }

}
