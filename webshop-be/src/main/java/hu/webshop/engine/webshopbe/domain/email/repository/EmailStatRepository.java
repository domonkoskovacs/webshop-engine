package hu.webshop.engine.webshopbe.domain.email.repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import hu.webshop.engine.webshopbe.domain.email.entity.EmailStat;


@Repository
public interface EmailStatRepository extends JpaRepository<EmailStat, UUID> {
    List<EmailStat> findAllByCreationTimeGreaterThanEqualAndCreationTimeLessThan(OffsetDateTime from, OffsetDateTime to);
}
