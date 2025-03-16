package hu.webshop.engine.webshopbe.infrastructure.model.request;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.product.value.Gender;
import jakarta.validation.constraints.NotNull;

public record ProductUpdateRequest(
        @NotNull String brand,
        @NotNull String name,
        @NotNull String description,
        @NotNull UUID subCategoryId,
        @NotNull Gender gender,
        @NotNull Integer count,
        @NotNull Double price,
        @NotNull Double discountPercentage,
        List<MultipartFile> newImages,
        List<String> existingImageIds,
        @NotNull String itemNumber
) {}
