package hu.webshop.engine.webshopbe.domain.auth.value;

public record Login(
        String accessToken,
        long accessTokenTimeout,
        String refreshToken,
        long refreshTokenTimeout,
        String tokenType,
        String role
) {
}
