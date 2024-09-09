package hu.webshop.engine.webshopbe.domain.store.entity;

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
@Table(name = "social_icon")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SocialIcon extends BaseEntity {

    @Column(name = "url")
    private String url;

    @Column(name = "icon")
    private String icon;

    @Column(name = "icon_position")
    private Integer position;
}
