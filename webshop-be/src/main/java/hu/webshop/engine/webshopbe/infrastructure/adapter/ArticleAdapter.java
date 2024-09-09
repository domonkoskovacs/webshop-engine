package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.article.ArticleService;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.ArticleMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ArticleRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ArticleResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleAdapter {

    private final ArticleService articleService;
    private final ArticleMapper articleMapper;

    public List<ArticleResponse> getAll() {
        log.info("getAll");
        return articleMapper.toResponseList(articleService.getAll());
    }

    public ArticleResponse get(UUID id) {
        log.info("get > id: [{}]", id);
        return articleMapper.toResponse(articleService.get(id));
    }

    public ArticleResponse create(ArticleRequest request) {
        log.info("create > request: [{}]", request);
        return articleMapper.toResponse(articleService.create(articleMapper.fromRequest(request), request.image()));
    }

    public void delete(UUID id) {
        log.info("delete > id: [{}]", id);
        articleService.delete(id);
    }
}
