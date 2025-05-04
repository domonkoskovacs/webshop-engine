package hu.webshop.engine.webshopbe.domain.email.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.email.entity.PromotionEmail;

@Repository
public interface PromotionEmailRepository extends JpaRepository<PromotionEmail, UUID> {
    boolean existsPromotionEmailByName(String name);
}
