package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.EmailAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Admin;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.EmailRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.PromotionEmailRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.PromotionEmailResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(
        name = "Email service",
        description = "REST endpoints for email service"
)
public class EmailController {

    private final EmailAdapter emailAdapter;

    @Operation(
            tags = {"Email service"},
            summary = "Create a new promotion email",
            description = "Admins can create a promotion email"
    )
    @PostMapping(value = ApiPaths.PromotionEmails.BASE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @Admin
    public ResponseEntity<PromotionEmailResponse> create(@RequestBody PromotionEmailRequest request) {
        log.info("create > request: [{}]", request);
        return ResponseEntity.status(HttpStatus.CREATED).body(emailAdapter.create(request));
    }

    @Operation(
            tags = {"Email service"},
            summary = "Get all promotion email",
            description = "Admins can get all promotion email"
    )
    @GetMapping(value = ApiPaths.PromotionEmails.BASE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Admin
    public ResponseEntity<List<PromotionEmailResponse>> getAll() {
        log.info("getAll");
        return ResponseEntity.ok(emailAdapter.getAll());
    }

    @Operation(
            tags = {"Email service"},
            summary = "Delete a promotion email",
            description = "Admins can delete a promotion email"
    )
    @DeleteMapping(ApiPaths.PromotionEmails.BY_ID)
    @Admin
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        log.info("delete > id: [{}]", id);
        emailAdapter.delete(id);
        return ResponseEntity.ok().build();
    }

    @Operation(
            tags = {"Email service"},
            summary = "Try out promotion email",
            description = "Admins can try out and test a promotion email"
    )
    @PostMapping(ApiPaths.PromotionEmails.TEST)
    @Admin
    public ResponseEntity<Void> test(@PathVariable UUID id, @RequestBody EmailRequest request) {
        log.info("test > id: [{}]", id);
        emailAdapter.test(id, request);
        return ResponseEntity.ok().build();
    }
}
