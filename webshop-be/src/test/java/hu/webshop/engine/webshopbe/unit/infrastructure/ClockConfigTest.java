package hu.webshop.engine.webshopbe.unit.infrastructure;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopbe.infrastructure.config.ClockConfig;

class ClockConfigTest {

    private final ClockConfig clockConfig = new ClockConfig();

    @Test
    @DisplayName("Clock bean should return system default zone")
    void clockBeanReturnsSystemDefaultZone() {
        //Given //When
        Clock clock = clockConfig.clock();

        // Then
        assertThat(clock).isNotNull();
        assertThat(clock.getZone()).isEqualTo(Clock.systemDefaultZone().getZone());
    }
}
