package hu.webshop.engine.webshopbe.unit.infrastructure;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.Resource;
import org.springframework.test.util.ReflectionTestUtils;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import hu.webshop.engine.webshopbe.infrastructure.config.EnvLoaderConfig;

@DisplayName("EnvLoaderConfig unit tests")
class EnvLoaderConfigTest {

    @Test
    @DisplayName("env loader works properly")
    void envLoaderWorksProperly() throws Exception {
        //Given
        Path tempDir = Files.createTempDirectory("tempTestDir");
        Path envFile = tempDir.resolve(".env");
        Files.createFile(envFile);
        String originalUserDir = System.getProperty("user.dir");
        System.setProperty("user.dir", tempDir.toString());

        try {
            //When
            PropertySourcesPlaceholderConfigurer configurer = EnvLoaderConfig.propertySourcesPlaceholderConfigurer();
            assertNotNull(configurer);
            Resource[] locations = (Resource[]) ReflectionTestUtils.getField(configurer, "locations");
            assertNotNull(locations);
            assertEquals(1, locations.length);
            String resourceDescription = locations[0].getDescription();

            //Then
            assertNotNull(resourceDescription);
            assertTrue(resourceDescription.contains(".env"));
        } finally {
            System.setProperty("user.dir", originalUserDir);
            Files.deleteIfExists(envFile);
            Files.deleteIfExists(tempDir);
        }
    }

    @Test
    @DisplayName("no env file was found")
    void noEnvFileWasFound() throws Exception {
        //Given
        LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
        ch.qos.logback.classic.Logger logger = loggerContext.getLogger(EnvLoaderConfig.class);
        ListAppender<ILoggingEvent> listAppender = new ListAppender<>();
        listAppender.start();
        logger.addAppender(listAppender);
        Path tempDir = Files.createTempDirectory("tempTestDir");
        String originalUserDir = System.getProperty("user.dir");
        System.setProperty("user.dir", tempDir.toString());

        try {
            //WHen
            PropertySourcesPlaceholderConfigurer configurer = EnvLoaderConfig.propertySourcesPlaceholderConfigurer();
            assertNotNull(configurer);
            boolean logFound = listAppender.list.stream()
                    .anyMatch(event -> event.getFormattedMessage()
                            .contains("No .env file found, skipping..."));

            //Then
            assertTrue(logFound);
        } finally {
            System.setProperty("user.dir", originalUserDir);
            Files.deleteIfExists(tempDir);
        }
    }
}

