package hu.webshop.engine.webshopbe.domain.store.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import hu.webshop.engine.webshopbe.domain.store.entity.Store;

@Mapper
public interface StoreUpdateMapper {

    @Mapping(target = "id", ignore = true)
    Store update(@MappingTarget Store updatable, Store newStore);
}
