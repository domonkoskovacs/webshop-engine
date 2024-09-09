package hu.webshop.engine.webshopbe.domain.product.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.product.entity.Category;


@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
}
