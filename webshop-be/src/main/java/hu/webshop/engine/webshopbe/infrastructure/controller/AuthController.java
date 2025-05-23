package hu.webshop.engine.webshopbe.infrastructure.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.AuthAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Public;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.LoginRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.TokenRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.LoginResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(
        name = "Auth service",
        description = "REST endpoints for auth service"
)
public class AuthController {
    private final AuthAdapter authAdapter;

    @Operation(
            tags = {"Auth service"},
            summary = "Login with an existing user",
            description = "Users can login with username and password and get an access token"
    )
    @Public
    @PostMapping(value = ApiPaths.Auth.LOGIN,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("login > loginRequest: [{}]", loginRequest);
        return ResponseEntity.ok(authAdapter.login(loginRequest));
    }

    @Operation(
            tags = {"Auth service"},
            summary = "Refresh access token",
            description = "Users can refresh their access token with a refresh token"
    )
    @Public
    @PostMapping(value = ApiPaths.Auth.REFRESH,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody TokenRequest token) {
        log.info("refreshToken");
        return ResponseEntity.ok(authAdapter.refresh(token.token()));
    }
}
