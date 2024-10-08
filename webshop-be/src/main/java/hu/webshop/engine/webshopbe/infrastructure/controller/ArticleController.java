package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.ArticleAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Admin;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ArticleRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ArticleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/article")
@RequiredArgsConstructor
@Tag(
        name = "Article service",
        description = "REST endpoints for article service"
)
public class ArticleController {

    private final ArticleAdapter articleAdapter;

    @Operation(
            tags = {"Article service"},
            summary = "Get all article",
            description = "Get all article"
    )
    @GetMapping(produces = "application/json")
    public ResponseEntity<List<ArticleResponse>> getAll() {
        log.info("getAll");
        return ResponseEntity.ok(articleAdapter.getAll());
    }

    @Operation(
            tags = {"Article service"},
            summary = "Get an article",
            description = "Get an article by id"
    )
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<ArticleResponse> get(@PathVariable UUID id) {
        log.info("get > id: [{}]", id);
        return ResponseEntity.ok(articleAdapter.get(id));
    }

    @Operation(
            tags = {"Article service"},
            summary = "Create a new article",
            description = "Administrator creates a new article"
    )
    @Admin
    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}, produces = "application/json")
    public ResponseEntity<ArticleResponse> create(@ModelAttribute ArticleRequest articleRequest) {
        log.info("create > articleRequest: [{}]", articleRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(articleAdapter.create(articleRequest));
    }

    @Operation(
            tags = {"Article service"},
            summary = "Delete an article",
            description = "Administrator can delete an article"
    )
    @Admin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("delete > id: [{}]", id);
        articleAdapter.delete(id);
        return ResponseEntity.ok().build();
    }
}
