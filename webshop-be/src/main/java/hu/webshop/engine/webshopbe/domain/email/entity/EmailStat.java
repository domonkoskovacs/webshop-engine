package hu.webshop.engine.webshopbe.domain.email.entity;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "email_stat")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailStat extends BaseEntity {

    @Column(name = "sent", nullable = false)
    private Integer sent;

    @Column(name = "email_type", nullable = false)
    private String emailType;
}
