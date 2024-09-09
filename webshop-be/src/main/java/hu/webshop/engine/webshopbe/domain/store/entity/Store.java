package hu.webshop.engine.webshopbe.domain.store.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "store")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Store extends BaseEntity {

    @Column(name = "min_order_price", nullable = false)
    private Double minOrderPrice;

    @Column(name = "theme")
    private String theme;

    @Column(name = "primary_color")
    private String primaryColor;

    @Column(name = "secondary_color")
    private String secondaryColor;

    @Column(name = "max_article")
    private Integer maxArticle;

    @Builder.Default
    @Column(name = "delete_out_of_stock_products", nullable = false)
    private Boolean deleteOutOfStockProducts = Boolean.FALSE;

    @Builder.Default
    @Column(name = "delete_unused_pictures", nullable = false)
    private Boolean deleteUnusedPictures = Boolean.FALSE;

    @Builder.Default
    @Column(name = "enable_built_in_marketing_emails", nullable = false)
    private Boolean enableBuiltInMarketingEmails = Boolean.FALSE;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "store_id", nullable = false)
    private List<SocialIcon> socialIcons;

    public void addSocialIcon(SocialIcon socialIcon) {
        if (socialIcons == null) {
            socialIcons = new ArrayList<>();
        }
        if (socialIcons.stream().anyMatch(s -> s.getPosition().equals(socialIcon.getPosition()))) {
            throw new IllegalStateException("SocialIcon is position is duplicated"); //todo handle positions dynamically
        }
        socialIcons.add(socialIcon);
    }

    public void removeSocialIcon(UUID id) {
        socialIcons.remove(socialIcons.stream().filter(s -> Objects.equals(s.getId(), id)).findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Social Icon was not found")) //todo update position
        );
    }
}
