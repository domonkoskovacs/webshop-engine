package hu.webshop.engine.webshopbe.domain.image.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;

@Repository
public interface ImageMetadataRepository extends JpaRepository<ImageMetadata, UUID> {
}
