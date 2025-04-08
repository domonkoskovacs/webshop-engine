package hu.webshop.engine.webshopbe.domain.article.entity;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "image_id", referencedColumnName = "id", nullable = false)
    private ImageMetadata image;

}
