package hu.webshop.engine.webshopbe;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import java.time.Clock;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(webEnvironment = RANDOM_PORT)
class WebshopBeApplicationIT {

    @Autowired
    private Clock clock;

    @Test
    void contextLoads() {
        WebshopBeApplication.main(new String[]{});
        assertThat(clock).isNotNull();
    }
}