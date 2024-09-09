package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.user.entity.Address;
import hu.webshop.engine.webshopbe.infrastructure.model.request.AddressRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.AddressResponse;

@Mapper
public interface AddressMapper {
    Address fromRequest(AddressRequest request);

    AddressResponse toResponse(Address entity);
}
