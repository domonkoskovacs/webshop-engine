package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import org.mapstruct.Mapper;
import org.springframework.context.annotation.Primary;

import hu.webshop.engine.webshopbe.domain.base.value.HandlerErrorModel;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ErrorResponse;

@Primary
@Mapper
public interface HandlerErrorMapper {
    ErrorResponse toResponse(HandlerErrorModel model);
}
