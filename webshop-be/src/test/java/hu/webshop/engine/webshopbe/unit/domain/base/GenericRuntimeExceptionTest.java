package hu.webshop.engine.webshopbe.unit.domain.base;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopbe.domain.base.exception.GenericRuntimeException;
import hu.webshop.engine.webshopbe.domain.base.value.HandlerErrorModel;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.base.value.ResultEntry;

@DisplayName("GenericRuntimeException unit tests")
class GenericRuntimeExceptionTest {

    @Test
    @DisplayName("should store response from constructor (HandlerErrorModel)")
    void shouldStoreResponseFromHandlerErrorModel() {
        // Given
        ResultEntry entry = ResultEntry.resultEntry(ReasonCode.ORDER_EXCEPTION, "Something went wrong");
        HandlerErrorModel model = new HandlerErrorModel();
        model.addError(entry);

        // When
        GenericRuntimeException exception = new GenericRuntimeException(model);

        // Then
        assertThat(exception.getResponse()).isNotNull();
        assertThat(exception.getResponse().error()).containsExactly(entry);
    }

    @Test
    @DisplayName("should create response with INTERNAL_SERVER_ERROR for single message")
    void shouldCreateResponseWithInternalServerError() {
        // Given
        String message = "Unexpected error occurred";

        // When
        GenericRuntimeException exception = new GenericRuntimeException(message);

        // Then
        assertThat(exception.getResponse()).isNotNull();
        List<ResultEntry> errors = exception.getResponse().error();
        assertThat(errors).hasSize(1);

        ResultEntry error = errors.get(0);
        assertThat(error.message()).isEqualTo(message);
        assertThat(error.reasonCode()).isEqualTo(ReasonCode.INTERNAL_SERVER_ERROR);
        assertThat(error.reasonCode().reasonStatus()).isEqualTo(ReasonCode.INTERNAL_SERVER_ERROR.reasonStatus());
    }
}
