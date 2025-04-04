package hu.webshop.engine.webshopbe.domain.image.entity;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@EntityListeners(ImageMetadataEntityListener.class)
@Table(name = "image_metadata")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageMetadata extends BaseEntity {

    @Column(name = "url")
    private String url;

    @Column(name = "filename", nullable = false)
    private String filename;

    @Column(name = "extension", nullable = false)
    private String extension;

    @Enumerated(EnumType.STRING)
    @Column(name = "storage_type", nullable = false)
    private ImageStorageType storageType;
}
