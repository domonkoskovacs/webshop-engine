package hu.webshop.engine.webshopbe.infrastructure.model.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ArticleRequest(
        @NotBlank String name,
        @NotBlank String text,
        @NotBlank String buttonText,
        @NotBlank String buttonLink,
        @NotNull MultipartFile image
) {
}
