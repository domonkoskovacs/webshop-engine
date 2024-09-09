package hu.webshop.engine.webshopbe.domain.article.entity;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "article")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Article extends BaseEntity {

    @Column(name = "article_name", nullable = false)
    private String name;

    @Column(name = "article_text", nullable = false)
    private String text;

    @Column(name = "button_text", nullable = false)
    private String buttonText;

    @Column(name = "button_link", nullable = false)
    private String buttonLink;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}
