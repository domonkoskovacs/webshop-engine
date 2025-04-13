package hu.webshop.engine.webshopbe.infrastructure.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.AuthAdapter;
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
@RequestMapping("/api/auth")
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
    @PostMapping(value = "/login", consumes = "application/json", produces = "application/json")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("login > loginRequest: [{}]", loginRequest);
        return ResponseEntity.ok(authAdapter.login(loginRequest));
    }

    @Operation(
            tags = {"Auth service"},
            summary = "Refresh access token",
            description = "Users can refresh their access token with a refresh token"
    )
    @PostMapping(value = "/refreshToken", consumes = "application/json", produces = "application/json")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody TokenRequest token) {
        log.info("refreshToken");
        return ResponseEntity.ok(authAdapter.refreshToken(token.token()));
    }
}
