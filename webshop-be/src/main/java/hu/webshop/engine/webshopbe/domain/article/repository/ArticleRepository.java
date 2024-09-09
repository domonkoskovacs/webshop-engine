package hu.webshop.engine.webshopbe.domain.article.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.article.entity.Article;

@Repository
public interface ArticleRepository extends JpaRepository<Article, UUID> {
}
