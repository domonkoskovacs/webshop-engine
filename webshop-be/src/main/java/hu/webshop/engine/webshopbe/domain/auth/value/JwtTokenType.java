package hu.webshop.engine.webshopbe.domain.auth.value;

public enum JwtTokenType {
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    INVALID_TOKEN;

    public boolean isAccessToken() {
        return this.equals(ACCESS_TOKEN);
    }

    public boolean isInvalidToken() {
        return this.equals(INVALID_TOKEN);
    }
}
