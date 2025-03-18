package hu.webshop.engine.webshopbe.integration.logging;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.apache.commons.collections4.MultiValuedMap;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.base.TestAppender;
import hu.webshop.engine.webshopbe.infrastructure.config.logging.PropertiesLogger;

@DisplayName("PropertiesLogger integration tests")
class PropertiesLoggerIT extends IntegrationTest {

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
}
