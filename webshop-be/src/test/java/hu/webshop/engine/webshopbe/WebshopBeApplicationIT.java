package hu.webshop.engine.webshopbe;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import java.time.Clock;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import hu.webshop.engine.webshopbe.base.IntegrationTest;

@ActiveProfiles(IntegrationTest.TEST_PROFILE)
@SpringBootTest(webEnvironment = RANDOM_PORT)
class WebshopBeApplicationIT {

    @Autowired
    private Clock clock;

    @Test
    void contextLoads() {
        assertThat(clock).isNotNull();
    }
}