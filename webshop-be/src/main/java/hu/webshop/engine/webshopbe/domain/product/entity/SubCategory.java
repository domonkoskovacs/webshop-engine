package hu.webshop.engine.webshopbe.domain.product.entity;

import java.util.ArrayList;
import java.util.List;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "sub_category")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubCategory extends BaseEntity {

    @Column(name = "sub_category_name", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "subCategory", fetch = FetchType.LAZY)
    private List<Product> products = new ArrayList<>();

}
