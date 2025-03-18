package hu.webshop.engine.webshopbe.base;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootContextLoader;

import hu.webshop.engine.webshopbe.infrastructure.config.logging.PropertiesLogger;

public class PropertiesLoggerLoader extends SpringBootContextLoader {

    @Override
    protected SpringApplication getSpringApplication() {
        SpringApplication application = super.getSpringApplication();
        application.addListeners(new PropertiesLogger());
        return application;
    }
}
