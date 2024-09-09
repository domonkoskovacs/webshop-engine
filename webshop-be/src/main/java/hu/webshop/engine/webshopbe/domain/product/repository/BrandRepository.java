package hu.webshop.engine.webshopbe.domain.product.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.product.entity.Brand;

@Repository
public interface BrandRepository extends JpaRepository<Brand, UUID> {
    Optional<Brand> findBrandByName(String name);

    Boolean existsByName(String name);
}
