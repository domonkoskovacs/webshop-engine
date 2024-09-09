package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import hu.webshop.engine.webshopbe.domain.article.entity.Article;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ArticleRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ArticleResponse;

@Mapper
public interface ArticleMapper {
    @Mapping(target = "imageUrl", ignore = true)
    Article fromRequest(ArticleRequest request);

    ArticleResponse toResponse(Article entity);

    List<ArticleResponse> toResponseList(List<Article> entities);
}
