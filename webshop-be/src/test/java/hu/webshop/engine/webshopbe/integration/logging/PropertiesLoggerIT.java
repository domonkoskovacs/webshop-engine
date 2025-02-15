package hu.webshop.engine.webshopbe.integration.logging;

import static hu.webshop.engine.webshopbe.base.IntegrationTest.TEST_PROFILE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

import java.util.List;

import org.apache.commons.collections4.MultiValuedMap;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootContextLoader;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import hu.webshop.engine.webshopbe.base.TestAppender;
import hu.webshop.engine.webshopbe.infrastructure.config.logging.PropertiesLogger;

@DisplayName("PropertiesLogger integration tests")
@SpringBootTest(webEnvironment = RANDOM_PORT)
@ActiveProfiles(TEST_PROFILE)
@ContextConfiguration(loader = PropertiesLoggerIT.Loader.class)
class PropertiesLoggerIT {

    @Test
    @DisplayName("property log is correct")
    void propertyLogIsCorrect() {
        //Given //When
        MultiValuedMap<String, ILoggingEvent> events = TestAppender.getEvents();
        List<ILoggingEvent> logs = (List<ILoggingEvent>) events.get(PropertiesLogger.class.getCanonicalName());

        //Then
        assertThat(logs).hasSizeGreaterThan(0);
        assertThat(logs.get(0))
                .extracting(ILoggingEvent::getFormattedMessage, ILoggingEvent::getLevel)
                .containsExactly("ApplicationPreparedEvent fired, first run: [true]", Level.DEBUG);
        assertThat(logs.get(1))
                .extracting(ILoggingEvent::getFormattedMessage, ILoggingEvent::getLevel)
                .containsExactly("-------- APPLICATION PROPERTIES --------", Level.INFO);
    }

    public static class Loader extends SpringBootContextLoader {
        @Override
        protected SpringApplication getSpringApplication() {
            SpringApplication application = super.getSpringApplication();
            application.addListeners(new PropertiesLogger());
            return application;
        }
    }
}
