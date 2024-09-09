package hu.webshop.engine.webshopbe.domain.article;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import hu.webshop.engine.webshopbe.domain.article.entity.Article;
import hu.webshop.engine.webshopbe.domain.article.repository.ArticleRepository;
import hu.webshop.engine.webshopbe.domain.image.ImageService;
import hu.webshop.engine.webshopbe.domain.image.value.ImageIdentifier;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final ImageService imageService;

    public List<Article> getAll() {
        return articleRepository.findAll();
    }

    public Article get(UUID id) {
        return articleRepository.findById(id).orElseThrow(this::entityNotFoundException);
    }

    private EntityNotFoundException entityNotFoundException() {
        return new EntityNotFoundException("Article was not found");
    }

    public Article create(Article article, MultipartFile image) {
        log.info("create > article: [{}]", article);
        ImageIdentifier imageId = imageService.saveImageToFolder(image);
        article.setImageUrl(imageService.getImageUrl(imageId));
        return articleRepository.save(article);
    }

    public void delete(UUID id) {
        log.info("delete > id: [{}]", id);
        articleRepository.deleteById(id);
    }
}
