package hu.webshop.engine.webshopbe.domain.product.model;

import hu.webshop.engine.webshopbe.domain.product.value.Gender;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProductCsv {
    private @NotNull String brand;
    private @NotNull String name;
    private @NotNull String description;
    private @NotNull String subCategoryName;
    private @NotNull Gender gender;
    private @NotNull Integer count;
    private @NotNull Double price;
    private @NotNull Double discountPercentage;
    private String imageUrls;
    private @NotNull String itemNumber;
}
