package hu.webshop.engine.webshopbe.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Profile("local")
@Configuration
@PropertySource(value = "file:${user.dir}/.env", ignoreResourceNotFound = true)
public class EnvLoaderConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        Resource resource = new FileSystemResource(System.getProperty("user.dir") + "/.env");
        if (resource.exists()) {
            configurer.setLocation(resource);
        } else {
            log.info("No .env file found, skipping...");
        }
        return configurer;
    }
}