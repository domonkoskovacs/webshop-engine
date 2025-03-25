package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.stream.Stream;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderStatus unit tests")
class OrderStatusTest {

    @DisplayName("isCancelable() should return true for CREATED, PAYMENT_FAILED, PAID, PROCESSING, PACKAGED; otherwise false")
    @ParameterizedTest(name = "{0} -> {1}")
    @MethodSource("cancelableStatusProvider")
    void testIsCancelable(OrderStatus status, boolean expected) {
        assertThat(status.isCancelable())
                .as("Checking isCancelable() for " + status)
                .isEqualTo(expected);
    }

    private static Stream<Arguments> cancelableStatusProvider() {
        return Stream.of(
                Arguments.of(OrderStatus.CREATED,         true),
                Arguments.of(OrderStatus.PAYMENT_FAILED,  true),
                Arguments.of(OrderStatus.PAID,            true),
                Arguments.of(OrderStatus.PROCESSING,      true),
                Arguments.of(OrderStatus.PACKAGED,        true),
                Arguments.of(OrderStatus.SHIPPING,        false)
        );
    }

    @DisplayName("isReturnable() should return true only for DELIVERED")
    @ParameterizedTest(name = "{0} -> {1}")
    @MethodSource("returnableStatusProvider")
    void testIsReturnable(OrderStatus status, boolean expected) {
        assertThat(status.isReturnable()).isEqualTo(expected);
    }

    private static Stream<Arguments> returnableStatusProvider() {
        return Stream.of(
                Arguments.of(OrderStatus.DELIVERED, true),
                Arguments.of(OrderStatus.CREATED,   false)
        );
    }

    @DisplayName("isNewStatusApplicable(...) should return true only for valid transitions")
    @ParameterizedTest(name = "{0} -> {1} => {2}")
    @MethodSource("newStatusApplicableProvider")
    void testIsNewStatusApplicable(OrderStatus current, OrderStatus newStatus, boolean expected) {
        assertThat(current.isNewStatusApplicable(newStatus)).isEqualTo(expected);
    }

    private static Stream<Arguments> newStatusApplicableProvider() {
        return Stream.of(
                // CREATED -> valid transitions
                Arguments.of(OrderStatus.CREATED, OrderStatus.PAID, true),
                Arguments.of(OrderStatus.CREATED, OrderStatus.PAYMENT_FAILED, true),
                Arguments.of(OrderStatus.CREATED, OrderStatus.CANCELLED, true),
                // CREATED -> invalid transitions
                Arguments.of(OrderStatus.CREATED, OrderStatus.PROCESSING, false),

                // PAYMENT_FAILED -> valid transitions
                Arguments.of(OrderStatus.PAYMENT_FAILED, OrderStatus.PAID, true),
                Arguments.of(OrderStatus.PAYMENT_FAILED, OrderStatus.CANCELLED, true),
                // PAYMENT_FAILED -> invalid transitions
                Arguments.of(OrderStatus.PAYMENT_FAILED, OrderStatus.PROCESSING, false),

                // PAID -> valid transitions
                Arguments.of(OrderStatus.PAID, OrderStatus.PROCESSING, true),
                Arguments.of(OrderStatus.PAID, OrderStatus.WAITING_FOR_REFUND, true),
                // PAID -> invalid transitions
                Arguments.of(OrderStatus.PAID, OrderStatus.PACKAGED, false),

                // PROCESSING -> valid transitions
                Arguments.of(OrderStatus.PROCESSING, OrderStatus.PACKAGED, true),
                Arguments.of(OrderStatus.PROCESSING, OrderStatus.WAITING_FOR_REFUND, true),
                // PROCESSING -> invalid transitions
                Arguments.of(OrderStatus.PROCESSING, OrderStatus.SHIPPING, false),

                // PACKAGED -> valid transitions
                Arguments.of(OrderStatus.PACKAGED, OrderStatus.SHIPPING, true),
                Arguments.of(OrderStatus.PACKAGED, OrderStatus.WAITING_FOR_REFUND, true),
                // PACKAGED -> invalid transitions
                Arguments.of(OrderStatus.PACKAGED, OrderStatus.DELIVERED, false),

                // SHIPPING -> valid transitions
                Arguments.of(OrderStatus.SHIPPING, OrderStatus.DELIVERED, true),
                // SHIPPING -> invalid transitions
                Arguments.of(OrderStatus.SHIPPING, OrderStatus.COMPLETED, false),

                // DELIVERED -> valid transitions
                Arguments.of(OrderStatus.DELIVERED, OrderStatus.COMPLETED, true),
                Arguments.of(OrderStatus.DELIVERED, OrderStatus.RETURN_REQUESTED, true),
                // DELIVERED -> invalid transitions
                Arguments.of(OrderStatus.DELIVERED, OrderStatus.CANCELLED, false),

                // WAITING_FOR_REFUND -> valid transitions
                Arguments.of(OrderStatus.WAITING_FOR_REFUND, OrderStatus.REFUNDED, true),
                // WAITING_FOR_REFUND -> invalid transitions
                Arguments.of(OrderStatus.WAITING_FOR_REFUND, OrderStatus.PROCESSING, false),

                // RETURN_REQUESTED -> valid transitions
                Arguments.of(OrderStatus.RETURN_REQUESTED, OrderStatus.RETURN_APPROVED, true),
                Arguments.of(OrderStatus.RETURN_REQUESTED, OrderStatus.RETURN_REJECTED, true),
                // RETURN_REQUESTED -> invalid transitions
                Arguments.of(OrderStatus.RETURN_REQUESTED, OrderStatus.RETURN_RECEIVED, false),

                // RETURN_APPROVED -> valid transitions
                Arguments.of(OrderStatus.RETURN_APPROVED, OrderStatus.RETURN_RECEIVED, true),
                // RETURN_APPROVED -> invalid transitions
                Arguments.of(OrderStatus.RETURN_APPROVED, OrderStatus.RETURN_COMPLETED, false),

                // RETURN_RECEIVED -> valid transitions
                Arguments.of(OrderStatus.RETURN_RECEIVED, OrderStatus.RETURN_COMPLETED, true),
                // RETURN_RECEIVED -> invalid transitions
                Arguments.of(OrderStatus.RETURN_RECEIVED, OrderStatus.RETURN_REQUESTED, false),

                // Final states -> no valid transitions
                Arguments.of(OrderStatus.COMPLETED, OrderStatus.PAID, false),
                Arguments.of(OrderStatus.CANCELLED, OrderStatus.PAID, false),
                Arguments.of(OrderStatus.REFUNDED, OrderStatus.PAID, false),
                Arguments.of(OrderStatus.RETURN_COMPLETED, OrderStatus.PAID, false),
                Arguments.of(OrderStatus.RETURN_REJECTED, OrderStatus.PAID, false)
        );
    }

    @DisplayName("shouldUpdateStock() should return true for CANCELLED, WAITING_FOR_REFUND, RETURN_RECEIVED; false otherwise")
    @ParameterizedTest(name = "{0} -> {1}")
    @MethodSource("shouldUpdateStockProvider")
    void testShouldUpdateStock(OrderStatus status, boolean expected) {
        assertThat(status.shouldUpdateStock()).isEqualTo(expected);
    }

    private static Stream<Arguments> shouldUpdateStockProvider() {
        return Stream.of(
                Arguments.of(OrderStatus.CANCELLED, true),
                Arguments.of(OrderStatus.WAITING_FOR_REFUND, true),
                Arguments.of(OrderStatus.RETURN_RECEIVED, true),
                Arguments.of(OrderStatus.CREATED, false)

        );
    }

    @DisplayName("shouldSendEmailNotification() should return true for PAYMENT_FAILED, PAID, SHIPPING, DELIVERED, RETURN_APPROVED, RETURN_RECEIVED, RETURN_REJECTED; false otherwise")
    @ParameterizedTest(name = "{0} -> {1}")
    @MethodSource("shouldSendEmailNotificationProvider")
    void testShouldSendEmailNotification(OrderStatus status, boolean expected) {
        assertThat(status.shouldSendEmailNotification()).isEqualTo(expected);
    }

    private static Stream<Arguments> shouldSendEmailNotificationProvider() {
        return Stream.of(
                Arguments.of(OrderStatus.PAYMENT_FAILED,   true),
                Arguments.of(OrderStatus.PAID,             true),
                Arguments.of(OrderStatus.SHIPPING,         true),
                Arguments.of(OrderStatus.DELIVERED,        true),
                Arguments.of(OrderStatus.RETURN_APPROVED,  true),
                Arguments.of(OrderStatus.RETURN_RECEIVED,  true),
                Arguments.of(OrderStatus.RETURN_REJECTED,  true),
                Arguments.of(OrderStatus.CREATED,          false)
        );
    }
}
