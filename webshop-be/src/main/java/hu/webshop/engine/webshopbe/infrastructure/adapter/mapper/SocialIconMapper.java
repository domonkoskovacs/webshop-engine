package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.store.entity.SocialIcon;
import hu.webshop.engine.webshopbe.infrastructure.model.request.SocialIconRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.SocialIconResponse;

@Mapper
public interface SocialIconMapper {

    SocialIcon fromRequest(SocialIconRequest request);

    SocialIconResponse toResponse(SocialIcon entity);
}
