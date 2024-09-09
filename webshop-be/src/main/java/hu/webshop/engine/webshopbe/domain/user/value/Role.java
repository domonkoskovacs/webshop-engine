package hu.webshop.engine.webshopbe.domain.user.value;

public enum Role {
    ROLE_ADMIN,
    ROLE_USER,
    ROLE_MONITORING,
    ROLE_SWAGGER;

    public String getRoleValue() {
        return this.name().substring(5);
    }
}
