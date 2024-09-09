package hu.webshop.engine.webshopbe.domain.order.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.order.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID>, JpaSpecificationExecutor<Order> {
    List<Order> findAllByOrderDateGreaterThanEqualAndOrderDateLessThan(OffsetDateTime from, OffsetDateTime to);
}
