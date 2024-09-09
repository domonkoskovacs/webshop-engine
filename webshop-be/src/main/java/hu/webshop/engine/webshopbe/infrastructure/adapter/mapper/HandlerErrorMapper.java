package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.base.value.HandlerErrorModel;
import hu.webshop.engine.webshopbe.infrastructure.model.response.HandlerErrorResponse;

@Mapper
public interface HandlerErrorMapper {
    HandlerErrorResponse toResponse(HandlerErrorModel model);
}
