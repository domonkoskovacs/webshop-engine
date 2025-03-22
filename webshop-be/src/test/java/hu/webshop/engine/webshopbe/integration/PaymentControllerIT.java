package hu.webshop.engine.webshopbe.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import com.github.database.rider.core.api.dataset.DataSet;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import lombok.RequiredArgsConstructor;

@DisplayName("Payment controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class PaymentControllerIT extends IntegrationTest {
    private static final String BASE_URL = "/api/payment/webhooks";
    private static final String ORDER_ID = "11f86506-8ea8-4908-b8f4-668c5ec6a1e1";
    private final OrderRepository orderRepository;

    @Test
    @DisplayName("Payment intent succeeded event is processed correctly")
    @DataSet("userWithOrder.yml")
    void paymentIntentSucceededEventIsProcessedCorrectly() throws Exception {
        //Given
        PaymentIntent paymentIntent = new PaymentIntent();
        paymentIntent.setId("pi_test");
        paymentIntent.setAmount(1000L);
        Event event = createSpyEvent("payment_intent.succeeded", paymentIntent);
        String payload = "{\"id\":\"evt_test\",\"type\":\"payment_intent.succeeded\"}";
        String signatureHeader = "signature";

        //When
        try (MockedStatic<Webhook> webhookMock = Mockito.mockStatic(Webhook.class)) {
            webhookMock.when(() ->
                            Webhook.constructEvent(Mockito.anyString(), Mockito.anyString(), Mockito.anyString()))
                    .thenReturn(event);

            ResultActions resultActions = performPost(BASE_URL, payload, signatureHeader);
            transaction();

            //Then
            resultActions.andExpect(status().isOk());
            awaitFor(() -> {
                Optional<Order> byId = orderRepository.findById(UUID.fromString(ORDER_ID));
                return byId.isPresent() &&
                        byId.get().getPaidDate() != null &&
                        byId.get().getStatus().equals(OrderStatus.PAID);
            });
        }
    }

    @Test
    @DisplayName("Payment intent failed event is processed correctly")
    @DataSet("userWithOrder.yml")
    void paymentIntentFailedEventIsProcessedCorrectly() throws Exception {
        //Given
        PaymentIntent failedIntent = new PaymentIntent();
        failedIntent.setId("pi_test");
        Event event = createSpyEvent("payment_intent.failed", failedIntent);
        String payload = "{\"id\":\"evt_test\",\"type\":\"payment_intent.failed\"}";
        String signatureHeader = "signature";

        //When
        try (MockedStatic<Webhook> webhookMock = Mockito.mockStatic(Webhook.class)) {
            webhookMock.when(() ->
                            Webhook.constructEvent(Mockito.anyString(), Mockito.anyString(), Mockito.anyString()))
                    .thenReturn(event);

            ResultActions resultActions = performPost(BASE_URL, payload, signatureHeader);
            transaction();

            //Then
            resultActions.andExpect(status().isOk());
            awaitFor(() -> {
                Optional<Order> byId = orderRepository.findById(UUID.fromString(ORDER_ID));
                return byId.isPresent() &&
                        byId.get().getStatus().equals(OrderStatus.PAYMENT_FAILED);
            });
        }
    }

    @Test
    @DisplayName("Refund succeeded event is processed correctly")
    @DataSet("orderWithRefundId.yml")
    void refundSucceededEventIsProcessedCorrectly() throws Exception {
        //Given
        Refund refund = new Refund();
        refund.setId("ref_test");
        refund.setStatus("succeeded");
        Event event = createSpyEvent("refund.updated", refund);
        String payload = "{\"id\":\"evt_test\",\"type\":\"refund.updated\"}";
        String signatureHeader = "signature";

        //When
        try (MockedStatic<Webhook> webhookMock = Mockito.mockStatic(Webhook.class)) {
            webhookMock.when(() ->
                            Webhook.constructEvent(Mockito.anyString(), Mockito.anyString(), Mockito.anyString()))
                    .thenReturn(event);

            ResultActions resultActions = performPost(BASE_URL, payload, signatureHeader);
            transaction();

            //Then
            resultActions.andExpect(status().isOk());
            awaitFor(() -> {
                Optional<Order> byId = orderRepository.findById(UUID.fromString(ORDER_ID));
                return byId.isPresent() &&
                        byId.get().getRefundedDate() != null &&
                        byId.get().getStatus().equals(OrderStatus.REFUNDED);
            });
        }
    }

    @Test
    @DisplayName("Signature verification exception results in Bad Request")
    @DataSet("userWithOrder.yml")
    void signatureVerificationExceptionResultsInBadRequest() throws Exception {
        //Given
        String payload = "{\"id\":\"evt_test\",\"type\":\"payment_intent.succeeded\"}";
        String signatureHeader = "signature";

        //When
        try (MockedStatic<Webhook> webhookMock = Mockito.mockStatic(Webhook.class)) {
            webhookMock.when(() ->
                            Webhook.constructEvent(Mockito.anyString(), Mockito.anyString(), Mockito.anyString()))
                    .thenThrow(new com.stripe.exception.SignatureVerificationException("Invalid signature", null));

            ResultActions resultActions = performPost(BASE_URL, payload, signatureHeader);
            transaction();

            //Then
            resultActions.andExpect(status().isBadRequest());
        }
    }

    @Test
    @DisplayName("Generic exception during event construction results in Bad Request")
    @DataSet("userWithOrder.yml")
    void genericExceptionResultsInBadRequest() throws Exception {
        //Given
        String payload = "{\"id\":\"evt_test\",\"type\":\"payment_intent.succeeded\"}";
        String signatureHeader = "signature";

        //When
        try (MockedStatic<Webhook> webhookMock = Mockito.mockStatic(Webhook.class)) {
            webhookMock.when(() ->
                            Webhook.constructEvent(Mockito.anyString(), Mockito.anyString(), Mockito.anyString()))
                    .thenThrow(new RuntimeException("Invalid payload"));

            ResultActions resultActions = performPost(BASE_URL, payload, signatureHeader);
            transaction();

            //Then
            resultActions.andExpect(status().isBadRequest());
        }
    }


    private Event createSpyEvent(String eventType, StripeObject eventData) {
        Event event = Mockito.spy(new Event());
        event.setType(eventType);
        EventDataObjectDeserializer deserializer = Mockito.mock(EventDataObjectDeserializer.class);
        Mockito.when(deserializer.getObject()).thenReturn(Optional.of(eventData));
        Mockito.doReturn(deserializer).when(event).getDataObjectDeserializer();
        return event;
    }
}
