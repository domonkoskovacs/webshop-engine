package hu.webshop.engine.webshopbe.infrastructure.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.AuthAdapter;
import hu.webshop.engine.webshopbe.infrastructure.model.request.LoginRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.TokenRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.AuthorizationResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.LoginResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
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
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        log.info("login > loginRequest: [{}]", loginRequest);
        return ResponseEntity.ok(authAdapter.login(loginRequest, response));
    }

    @Operation(
            tags = {"Auth service"},
            summary = "Refresh access token",
            description = "Users can refresh their access token with a refresh token"
    )
    @PostMapping(value = "/refreshToken")
    public ResponseEntity<LoginResponse> refreshToken(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        log.info("refreshToken");
        return ResponseEntity.ok(authAdapter.refreshToken(refreshToken));
    }

    @Operation(
            tags = {"Auth service"},
            summary = "Authorization of an access token",
            description = "An access token can be authorized, and the user id can be extracted"
    )
    @PostMapping(value = "/authorize", consumes = "application/json", produces = "application/json")
    public ResponseEntity<AuthorizationResponse> authorize(@RequestBody TokenRequest token) {
        log.info("authorize");
        return ResponseEntity.ok(authAdapter.authorize(token.token()));
    }

    @Operation(
            tags = {"Auth service"},
            summary = "Log out",
            description = "User can log out"
    )
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        log.info("logout");
        authAdapter.logout(response);
        return ResponseEntity.ok().build();
    }
}
