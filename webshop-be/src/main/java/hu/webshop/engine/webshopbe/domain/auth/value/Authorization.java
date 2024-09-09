package hu.webshop.engine.webshopbe.domain.auth.value;

import hu.webshop.engine.webshopbe.domain.user.value.Role;

public record Authorization(String userId, Role role, JwtTokenType tokenType) {
}
