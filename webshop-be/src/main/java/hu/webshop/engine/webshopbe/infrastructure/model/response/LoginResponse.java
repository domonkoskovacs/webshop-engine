package hu.webshop.engine.webshopbe.infrastructure.model.response;

public record LoginResponse(
        String accessToken,
        long accessTokenTimeout,
        String tokenType,
        String role
) {
}
