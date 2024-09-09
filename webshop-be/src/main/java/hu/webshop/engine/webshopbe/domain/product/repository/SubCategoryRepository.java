package hu.webshop.engine.webshopbe.domain.product.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.product.entity.SubCategory;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, UUID> {
    Boolean existsByName(String name);

    Optional<SubCategory> findByName(String name);
}
