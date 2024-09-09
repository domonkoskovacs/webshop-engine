package hu.webshop.engine.webshopbe.infrastructure.config.logging;

import java.util.Arrays;
import java.util.Map;
import java.util.Objects;

import org.springframework.boot.context.event.ApplicationPreparedEvent;
import org.springframework.boot.env.OriginTrackedMapPropertySource;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.lang.NonNull;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PropertiesLogger implements ApplicationListener<ApplicationPreparedEvent> {

    private static final String PASSWORD_PROPERTY_NAME = "password";
    private static final String PASSWORD_PROPERTY_VALUE = "********";
    private boolean isFirstRun = true;

    @Override
    public void onApplicationEvent(@NonNull ApplicationPreparedEvent event) {
        log.debug("ApplicationPreparedEvent fired, first run: [{}]", isFirstRun);
        if (isFirstRun) {
            printProperties(event.getApplicationContext().getEnvironment());
            isFirstRun = false;
        }
    }

    /**
     * logs every property to the console,
     * prints all property files that is before the active profile
     * hides passwords
     *
     * @param environment environment of the event
     */
    private void printProperties(ConfigurableEnvironment environment) {
        log.info("-------- APPLICATION PROPERTIES --------");
        environment.getPropertySources().stream()
                .filter(OriginTrackedMapPropertySource.class::isInstance)
                .map(OriginTrackedMapPropertySource.class::cast)
                .flatMap(propertySource ->
                        Arrays.stream(propertySource.getPropertyNames())
                                .sorted()
                                .map(propertyName -> propertyEntry(environment, propertyName)))
                .forEach(entry -> log.info("{} = {}", entry.getKey(), entry.getValue()));
    }

    private static Map.Entry<String, String> propertyEntry(ConfigurableEnvironment environment, String propertyName) {
        String resolvedProperty = environment.getProperty(propertyName);
        return Map.entry(propertyName, propertyName.contains(PASSWORD_PROPERTY_NAME) ?
                PASSWORD_PROPERTY_VALUE :
                Objects.requireNonNull(resolvedProperty));
    }
}
