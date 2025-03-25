package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCancelParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentRetrieveParams;
import com.stripe.param.RefundCreateParams;
import hu.webshop.engine.webshopbe.domain.base.exception.StripeException;
import hu.webshop.engine.webshopbe.domain.order.StripeService;
import hu.webshop.engine.webshopbe.domain.order.properties.StripeProperties;
import hu.webshop.engine.webshopbe.domain.order.value.Currency;
import hu.webshop.engine.webshopbe.domain.order.value.Intent;

@ExtendWith(MockitoExtension.class)
@DisplayName("StripeService unit tests")
class StripeServiceTest {

    @InjectMocks
    private StripeService stripeService;
    @Mock
    private StripeProperties stripeProperties;

    @Test
    @DisplayName("create intent is correct")
    void createIntentIsCorrect() {
        //Given
        Intent intent = new Intent(50.0, Currency.USD, "test@test.com", UUID.randomUUID());
        PaymentIntent paymentIntent = new PaymentIntent();

        try (MockedStatic<PaymentIntent> paymentIntentMockedStatic = mockStatic(PaymentIntent.class)) {
            paymentIntentMockedStatic.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenReturn(paymentIntent);
            //When
            PaymentIntent result = stripeService.createIntent(intent);

            //Then
            assertThat(result).isEqualTo(paymentIntent);
        }
    }

    @Test
    @DisplayName("create intent exception is handled")
    void createIntentExceptionIsHandled() {
        //Given
        Intent intent = mock(Intent.class);
        when(intent.amount()).thenReturn(20.0);
        when(intent.currency()).thenReturn(Currency.USD);
        UUID orderId = UUID.randomUUID();
        when(intent.orderId()).thenReturn(orderId);
        when(intent.email()).thenReturn(null);
        com.stripe.exception.StripeException stripeException = new com.stripe.exception.StripeException("message", "requestId", "code",0) {};

        try (MockedStatic<PaymentIntent> paymentIntentMockedStatic = mockStatic(PaymentIntent.class)) {
            paymentIntentMockedStatic.when(() -> PaymentIntent.create(any(PaymentIntentCreateParams.class)))
                    .thenThrow(stripeException);

            //When //Then
            assertThatThrownBy(() -> stripeService.createIntent(intent))
                    .isInstanceOf(StripeException.class);
        }
    }

    @Test
    @DisplayName("retrieve intent is correct")
    void retrieveIntentIsCorrect() {
        //Given
        String intentId = UUID.randomUUID().toString();
        PaymentIntent paymentIntent = new PaymentIntent();

        try (MockedStatic<PaymentIntent> paymentIntentMockedStatic = mockStatic(PaymentIntent.class)) {
            paymentIntentMockedStatic.when(() -> PaymentIntent.retrieve(any(String.class), any(PaymentIntentRetrieveParams.class), any()))
                    .thenReturn(paymentIntent);
            //When
            PaymentIntent result = stripeService.retrieveIntent(intentId);

            //Then
            assertThat(result).isEqualTo(paymentIntent);
        }
    }

    @Test
    @DisplayName("retrieve payment intent handles exception")
    void retrievePaymentIntentHandlesException() {
        //Given
        String intentId = UUID.randomUUID().toString();
        com.stripe.exception.StripeException stripeException = new com.stripe.exception.StripeException("message", "requestId", "code",0) {};

        try (MockedStatic<PaymentIntent> paymentIntentMockedStatic = mockStatic(PaymentIntent.class)) {
            paymentIntentMockedStatic.when(() -> PaymentIntent.retrieve(any(String.class), any(PaymentIntentRetrieveParams.class), any()))
                    .thenThrow(stripeException);

            //When //Then
            assertThatThrownBy(() -> stripeService.retrieveIntent(intentId))
                    .isInstanceOf(StripeException.class);
        }
    }

    @Test
    @DisplayName("cancel payment is correct when already success")
    void cancelPaymentIsCorrectWhenAlreadySuccess() {
        //Given
        String intentId = UUID.randomUUID().toString();
        PaymentIntent paymentIntent = spy(new PaymentIntent());
        doReturn("succeeded").when(paymentIntent).getStatus();

        try (MockedStatic<PaymentIntent> paymentIntentMockedStatic = Mockito.mockStatic(PaymentIntent.class)) {
            paymentIntentMockedStatic.when(() ->
                            PaymentIntent.retrieve(any(String.class), any(PaymentIntentRetrieveParams.class), any()))
                    .thenReturn(paymentIntent);

            //When
            PaymentIntent result = stripeService.cancelPaymentIntent(intentId);

            //Then
            verify(paymentIntent, never()).cancel(any(PaymentIntentCancelParams.class));
            assertThat(result).isEqualTo(paymentIntent);
        } catch (com.stripe.exception.StripeException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    @DisplayName("cancel intent correct when cancel occurs")
    void cancelIntentCorrectWhenCancelOccurs() throws com.stripe.exception.StripeException {
        //Given
        String intentId = UUID.randomUUID().toString();
        PaymentIntent paymentIntent = spy(new PaymentIntent());
        doReturn("requires_payment_method").when(paymentIntent).getStatus();
        PaymentIntent canceledPaymentIntent = spy(new PaymentIntent());
        doReturn("canceled").when(canceledPaymentIntent).getStatus();
        doReturn(canceledPaymentIntent).when(paymentIntent).cancel(any(PaymentIntentCancelParams.class));

        try (MockedStatic<PaymentIntent> paymentIntentMockedStatic = Mockito.mockStatic(PaymentIntent.class)) {
            paymentIntentMockedStatic.when(() ->
                            PaymentIntent.retrieve(any(String.class), any(PaymentIntentRetrieveParams.class), any()))
                    .thenReturn(paymentIntent);

            //When
            PaymentIntent result = stripeService.cancelPaymentIntent(intentId);

            //Then
            verify(paymentIntent, times(1)).cancel(any(PaymentIntentCancelParams.class));
            assertThat(result.getStatus()).isEqualTo("canceled");
        }
    }

    @Test
    @DisplayName("intent cancel handles exception correctly")
    void intentCancelHandlesExceptionCorrectly() throws com.stripe.exception.StripeException {
        //Given
        String intentId = UUID.randomUUID().toString();
        PaymentIntent intent = spy(new PaymentIntent());
        Mockito.doReturn("processing").when(intent).getStatus();
        com.stripe.exception.StripeException stripeException = new com.stripe.exception.StripeException("message", "requestId", "code",0) {};

        doThrow(stripeException)
                .when(intent)
                .cancel(any(PaymentIntentCancelParams.class));

        try (MockedStatic<PaymentIntent> paymentIntentMockedStatic = mockStatic(PaymentIntent.class)) {
            paymentIntentMockedStatic.when(() ->
                            PaymentIntent.retrieve(any(String.class), any(PaymentIntentRetrieveParams.class), any()))
                    .thenReturn(intent);

            //When //Then
            assertThatThrownBy(() -> stripeService.cancelPaymentIntent(intentId))
                    .isInstanceOf(StripeException.class);
        }
    }

    @Test
    @DisplayName("create refund is correct")
    void createRefundIsCorrect() {
        //Given
        String intentId = UUID.randomUUID().toString();
        Double totalPrice = 50.0;
        Refund refund = new Refund();

        try (MockedStatic<Refund> refundMockedStatic = mockStatic(Refund.class)) {
            refundMockedStatic.when(() -> Refund.create(any(RefundCreateParams.class)))
                    .thenReturn(refund);

            //When
            Refund result = stripeService.createRefund(intentId, totalPrice);

            //Then
            assertThat(result).isEqualTo(refund);
        }
    }

    @Test
    @DisplayName("create refund handles exception correctly")
    void createRefundHandlesExceptionCorrectly() {
        // Given
        String intentId = UUID.randomUUID().toString();
        Double totalPrice = 20.0;
        com.stripe.exception.StripeException stripeException = new com.stripe.exception.StripeException("message", "requestId", "code",0) {};

        try (MockedStatic<Refund> refundMockedStatic = mockStatic(Refund.class)) {
            refundMockedStatic.when(() -> Refund.create(any(RefundCreateParams.class)))
                    .thenThrow(stripeException);

            // When/Then
            assertThatThrownBy(() -> stripeService.createRefund(intentId, totalPrice))
                    .isInstanceOf(StripeException.class);
        }
    }
}
