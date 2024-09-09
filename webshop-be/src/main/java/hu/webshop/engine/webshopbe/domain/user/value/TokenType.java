package hu.webshop.engine.webshopbe.domain.user.value;

public enum TokenType {
    BEARER;

    public static final String BEARER_PREFIX = "Bearer ";

    @Override
    public String toString() {
        return "Bearer";
    }
}
