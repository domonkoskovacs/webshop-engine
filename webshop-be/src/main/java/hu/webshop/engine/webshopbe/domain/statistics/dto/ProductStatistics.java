package hu.webshop.engine.webshopbe.domain.statistics.dto;


import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductStatistics {
    private Product product;
    private Integer count;
}
