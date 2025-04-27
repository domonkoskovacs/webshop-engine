package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.order.PaymentService;
import hu.webshop.engine.webshopbe.domain.order.properties.PaymentProperties;
import hu.webshop.engine.webshopbe.domain.order.strategy.PaymentStrategy;
import hu.webshop.engine.webshopbe.domain.order.strategy.PaymentStrategyRegistry;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentType;

@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentService unit tests")
class PaymentServiceTest {

    @InjectMocks
    private PaymentService paymentService;

    @Mock
    private PaymentProperties paymentProperties;

    @Mock
    private PaymentStrategyRegistry paymentStrategyRegistry;

    @Mock
    private PaymentStrategy paymentStrategy;

    @Test
    @DisplayName("cancelPaymentIntent uses correct strategy when not in demo mode")
    void cancelPaymentIntentUsesRequestedStrategy() {
        // Given
        String paymentIntentId = "pi_test_123";
        PaymentType requestedPaymentType = PaymentType.STRIPE;
        when(paymentProperties.isDemoMode()).thenReturn(false);
        when(paymentStrategyRegistry.get(requestedPaymentType)).thenReturn(paymentStrategy);

        //When //Then
        assertThatCode(() -> paymentService.cancelPaymentIntent(paymentIntentId, requestedPaymentType))
                .doesNotThrowAnyException();

        verify(paymentStrategy).cancelPaymentIntent(paymentIntentId);
    }
}
