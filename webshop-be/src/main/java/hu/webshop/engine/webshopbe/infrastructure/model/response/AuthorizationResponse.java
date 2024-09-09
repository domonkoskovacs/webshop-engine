package hu.webshop.engine.webshopbe.infrastructure.model.response;

import hu.webshop.engine.webshopbe.domain.auth.value.JwtTokenType;
import hu.webshop.engine.webshopbe.domain.user.value.Role;

public record AuthorizationResponse(String userId, Role role, JwtTokenType tokenType) {

}
