package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopbe.domain.order.properties.PaymentProperties;

@DisplayName("PaymentProperties unit tests")
class PaymentPropertiesTest {

    @AfterAll
    static void cleanup() {
        System.clearProperty("spring.profiles.active");
    }

    @Test
    @DisplayName("validateAndInitialize sets demoMode when keys are missing")
    void validateAndInitializeSetsDemoModeWhenKeysMissing() {
        //Given
        PaymentProperties properties = new PaymentProperties();
        properties.setPrivateKey("");
        properties.setEndpointSecret(null);

        //When
        properties.validateAndInitialize();

        //Then
        assertThat(properties.isDemoMode()).isTrue();
    }

    @Test
    @DisplayName("validateAndInitialize throws IllegalStateException when demoMode is true in production")
    void validateAndInitializeThrowsInProductionDemoMode() {
        //Given
        PaymentProperties properties = new PaymentProperties();
        properties.setDemoMode(true);
        System.setProperty("spring.profiles.active", "prod");

        //When //Then
        assertThatThrownBy(properties::validateAndInitialize)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Demo payment mode is not allowed in production!");
    }

    @Test
    @DisplayName("validateAndInitialize does nothing when config is valid and not production profile")
    void validateAndInitializeDoesNothingWhenConfigValid() {
        //Given
        PaymentProperties properties = new PaymentProperties();
        properties.setPrivateKey("some-key");
        properties.setEndpointSecret("some-secret");
        properties.setDemoMode(false);
        System.setProperty("spring.profiles.active", "dev");

        //When
        properties.validateAndInitialize();

        //Then
        assertThat(properties.isDemoMode()).isFalse();
    }
}
