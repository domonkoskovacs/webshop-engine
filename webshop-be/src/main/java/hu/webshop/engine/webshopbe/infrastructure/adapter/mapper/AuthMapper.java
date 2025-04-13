package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.auth.value.Credentials;
import hu.webshop.engine.webshopbe.domain.auth.value.Login;
import hu.webshop.engine.webshopbe.infrastructure.model.request.LoginRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.LoginResponse;


@Mapper
public interface AuthMapper {

    LoginResponse toResponse(Login model);

    Credentials fromRequest(LoginRequest request);
}
