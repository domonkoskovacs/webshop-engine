package hu.webshop.engine.webshopbe.infrastructure.model.response;

public record LoginResponse(
        String accessToken,
        long accessTokenTimeout,
        String refreshToken,
        long refreshTokenTimeout,
        String tokenType,
        String role
) {
}
