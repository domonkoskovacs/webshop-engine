package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.store.entity.Store;
import hu.webshop.engine.webshopbe.infrastructure.model.request.StoreRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.PublicStoreResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.StoreResponse;

@Mapper
public interface StoreMapper {

    Store fromRequest(StoreRequest request);

    StoreResponse toResponse(Store store);

    PublicStoreResponse toPublicResponse(Store store);
}
