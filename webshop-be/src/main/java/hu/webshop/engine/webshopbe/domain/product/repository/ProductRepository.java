package hu.webshop.engine.webshopbe.domain.product.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.product.entity.Product;


@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    List<Product> findAllByCountIsLessThanEqualAndCreationTimeLessThan(int minCount, OffsetDateTime before);
}
