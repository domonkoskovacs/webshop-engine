package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.StoreAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Admin;
import hu.webshop.engine.webshopbe.infrastructure.model.request.SocialIconRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.StoreRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.StoreResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
@Tag(
        name = "Store service",
        description = "REST endpoints for store service"
)
public class StoreController {

    private final StoreAdapter storeAdapter;

    @Operation(
            tags = {"Store service"},
            summary = "Get store configuration",
            description = "Admin can retrieve store configuration"
    )
    @GetMapping(produces = "application/json")
    @Admin
    public ResponseEntity<StoreResponse> getStore() {
        log.info("getStore");
        return ResponseEntity.status(HttpStatus.OK).body(storeAdapter.getStore());
    }

    @Operation(
            tags = {"Store service"},
            summary = "Update store configuration",
            description = "Admin can update store configuration"
    )
    @PutMapping(produces = "application/json", consumes = "application/json")
    @Admin
    public ResponseEntity<StoreResponse> updateStore(@RequestBody StoreRequest request) {
        log.info("updateStore > request: [{}]", request);
        return ResponseEntity.status(HttpStatus.OK).body(storeAdapter.updateStore(request));
    }

    @Operation(
            tags = {"Store service"},
            summary = "Add Social Icon",
            description = "Add Social Icon"
    )
    @PostMapping(value = "/socialIcon", produces = "application/json", consumes = "application/json")
    @Admin
    public ResponseEntity<StoreResponse> addSocialIcon(@RequestBody SocialIconRequest socialIconRequest) {
        log.info("addSocialIcon > socialIconRequest: [{}]", socialIconRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(storeAdapter.addIcon(socialIconRequest));
    }

    @Operation(
            tags = {"Store service"},
            summary = "Delete Social Icon",
            description = "Delete Social Icon"
    )
    @DeleteMapping(value = "/socialIcon/{id}", produces = "application/json")
    @Admin
    public ResponseEntity<StoreResponse> deleteSocialIcon(@PathVariable UUID id) {
        log.info("deleteSocialIcon > id: [{}]", id);
        return ResponseEntity.ok().body(storeAdapter.removeIcon(id));
    }
}
