package hu.webshop.engine.webshopbe;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import hu.webshop.engine.webshopbe.base.IntegrationTest;

class WebshopBeApplicationIT extends IntegrationTest {

    @Autowired
    private Clock clock;

    @Test
    void contextLoads() {
        assertThat(clock).isNotNull();
    }
}