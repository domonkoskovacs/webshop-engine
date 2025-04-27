package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThatCode;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.order.OrderPaymentStatusService;
import hu.webshop.engine.webshopbe.domain.order.strategy.DemoPaymentStrategy;

@ExtendWith(MockitoExtension.class)
@DisplayName("DemoPaymentStrategy unit tests")
class DemoPaymentStrategyTest {

    @InjectMocks
    private DemoPaymentStrategy demoPaymentStrategy;
    @Mock
    private OrderPaymentStatusService orderPaymentStatusService;

    @Test
    @DisplayName("cancelPaymentIntent logs paymentIntentId")
    void cancelPaymentIntentLogs() {
        //Given
        String paymentIntentId = "pi_test_123";

        //When //Then
        assertThatCode(() -> demoPaymentStrategy.cancelPaymentIntent(paymentIntentId))
                .doesNotThrowAnyException();    }
}
