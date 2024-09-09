package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import hu.webshop.engine.webshopbe.domain.store.entity.Store;
import hu.webshop.engine.webshopbe.infrastructure.model.request.StoreRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.StoreResponse;

@Mapper(uses = {SocialIconMapper.class})
public interface StoreMapper {

    @Mapping(target = "socialIcons", ignore = true)
    Store fromRequest(StoreRequest request);

    StoreResponse toResponse(Store store);
}
