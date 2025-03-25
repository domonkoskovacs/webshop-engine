package hu.webshop.engine.webshopbe;

import java.util.Locale;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import hu.webshop.engine.webshopbe.infrastructure.config.logging.PropertiesLogger;

@SpringBootApplication
public class WebshopBeApplication {

    public static void main(String[] args) {
        Locale.setDefault(Locale.forLanguageTag("hu-HU"));
        SpringApplication application = new SpringApplication(WebshopBeApplication.class);
        application.addListeners(new PropertiesLogger());
        application.run(args);
    }

}
