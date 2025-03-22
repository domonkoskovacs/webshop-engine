package hu.webshop.engine.webshopbe.unit.infrastructure;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import hu.webshop.engine.webshopbe.domain.order.OrderPaymentService;
import hu.webshop.engine.webshopbe.infrastructure.adapter.PaymentAdapter;

@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentAdapter unit tests")
class PaymentAdapterTest {

    @Mock
    private OrderPaymentService orderService;

    @InjectMocks
    private PaymentAdapter paymentAdapter;

    @Test
    @DisplayName("unknown event type does nothing")
    void unknownEventTypeDoesNothing() {
        //Given
        Event event = Mockito.spy(new Event());
        event.setType("unknown.event");

        //When
        paymentAdapter.handleStripeEvent(event);

        //Then
        verifyNoInteractions(orderService);
    }

    @Test
    @DisplayName("missing deserialized object does nothing")
    void missingDeserializedObjectDoesNothing() {
        //Given
        Event event = Mockito.spy(new Event());
        event.setType("payment_intent.succeeded");
        EventDataObjectDeserializer deserializer = Mockito.mock(EventDataObjectDeserializer.class);
        when(deserializer.getObject()).thenReturn(Optional.empty());
        doReturn(deserializer).when(event).getDataObjectDeserializer();

        //When
        paymentAdapter.handleStripeEvent(event);

        //Then
        verify(orderService, never()).paymentIntentSucceeded(any(PaymentIntent.class));

    }
}
