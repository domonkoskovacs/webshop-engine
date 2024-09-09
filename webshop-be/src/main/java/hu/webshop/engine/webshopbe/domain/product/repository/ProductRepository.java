package hu.webshop.engine.webshopbe.domain.product.repository;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.product.entity.Product;


@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    void deleteAllByCountIsLessThanEqualAndCreationTimeLessThan(int minCount, OffsetDateTime before);
}
