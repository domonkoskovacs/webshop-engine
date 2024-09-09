package hu.webshop.engine.webshopbe.domain.store.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.store.entity.Store;

@Repository
public interface StoreRepository extends JpaRepository<Store, UUID> {
}
