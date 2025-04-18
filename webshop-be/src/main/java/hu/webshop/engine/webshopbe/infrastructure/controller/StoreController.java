package hu.webshop.engine.webshopbe.infrastructure.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.StoreAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Admin;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.StoreRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.PublicStoreResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.StoreResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
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
    @GetMapping(value = ApiPaths.Store.BASE,
            produces = MediaType.APPLICATION_JSON_VALUE)
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
    @PutMapping(value = ApiPaths.Store.BASE,
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    @Admin
    public ResponseEntity<StoreResponse> updateStore(@RequestBody StoreRequest request) {
        log.info("updateStore > request: [{}]", request);
        return ResponseEntity.status(HttpStatus.OK).body(storeAdapter.updateStore(request));
    }

    @Operation(
            tags = {"Store service"},
            summary = "Get public store configuration",
            description = "Retrieve essential store settings for users"
    )
    @GetMapping(value = ApiPaths.Store.PUBLIC,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PublicStoreResponse> getPublicStore() {
        log.info("getPublicStore");
        return ResponseEntity.status(HttpStatus.OK).body(storeAdapter.getPublicStore());
    }
}
