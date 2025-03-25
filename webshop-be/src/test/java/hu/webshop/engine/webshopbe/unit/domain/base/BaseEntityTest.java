package hu.webshop.engine.webshopbe.unit.domain.base;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopbe.domain.base.entity.BaseEntity;

@DisplayName("BaseEntity unit test")
class BaseEntityTest {

    @Test
    void canCreateBaseEntityInstance() {
        BaseEntity entity = new BaseEntity();
        UUID id = UUID.randomUUID();
        entity.setId(id);

        assertThat(entity.getId()).isEqualTo(id);
    }

}
