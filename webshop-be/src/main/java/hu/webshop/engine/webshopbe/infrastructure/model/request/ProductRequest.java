package hu.webshop.engine.webshopbe.infrastructure.model.request;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotNull;

public record ProductRequest(
        @NotNull String brand,
        @NotNull String name,
        @NotNull String description,
        @NotNull UUID subCategoryId,
        @NotNull String type,
        @NotNull Integer count,
        @NotNull Double price,
        Double discountPercentage,
        List<MultipartFile> images,
        @NotNull String itemNumber
) {
}
