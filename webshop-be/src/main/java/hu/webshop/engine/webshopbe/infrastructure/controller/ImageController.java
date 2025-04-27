package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.util.UUID;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.ImageAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Public;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(
        name = "Image service",
        description = "REST endpoints for image service"
)
public class ImageController {

    private final ImageAdapter imageAdapter;

    @Operation(
            tags = {"Image service"},
            summary = "Get an image",
            description = "Public endpoint returns an image by id and extension"
    )
    @Public
    @GetMapping(value = ApiPaths.Images.BY_ID,
            produces = {MediaType.IMAGE_PNG_VALUE, MediaType.IMAGE_JPEG_VALUE})
    public ResponseEntity<ByteArrayResource> getById(@PathVariable UUID id) {
        log.info("getImage > id: [{}]", id);
        return ResponseEntity.ok().body(imageAdapter.getById(id));
    }
}
