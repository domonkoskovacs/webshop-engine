package hu.webshop.engine.webshopbe.unit.infrastructure;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;

import hu.webshop.engine.webshopbe.domain.base.exception.CsvException;
import hu.webshop.engine.webshopbe.domain.base.exception.GenericRuntimeException;
import hu.webshop.engine.webshopbe.domain.base.exception.ImageException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.base.value.ResultEntry;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.HandlerErrorMapper;
import hu.webshop.engine.webshopbe.infrastructure.controller.handler.ControllerExceptionHandler;
import hu.webshop.engine.webshopbe.infrastructure.model.response.HandlerErrorResponse;

@ExtendWith(MockitoExtension.class)
@DisplayName("exception handler unit tests")
class ControllerExceptionHandlerTest {
    @Mock
    private HandlerErrorMapper errorMapper;

    @InjectMocks
    private ControllerExceptionHandler exceptionHandler;

    @Test
    @DisplayName("csv exception is handled")
    void csvExceptionIsHandled() {
        //Given
        ReasonCode reasonCode = ReasonCode.CSV_ERROR;
        String errorMessage = "Error message";
        CsvException exception = new CsvException(ReasonCode.CSV_ERROR, errorMessage);
        when(errorMapper.toResponse(exception.getResponse())).thenReturn(new HandlerErrorResponse(
                exception.getResponse().info(),
                exception.getResponse().error(),
                exception.getResponse().warning()
        ));

        //When
        HandlerErrorResponse handlerErrorResponse = exceptionHandler.csvException(exception);

        //Then
        assertThat(handlerErrorResponse.error()).hasSizeGreaterThan(0)
                .allMatch(error -> error.reasonCode().reasonStatus() == reasonCode.reasonStatus())
                .allMatch(error -> error.reasonCode() == reasonCode)
                .allMatch(error -> error.message().equals(errorMessage));
    }

    @Test
    @DisplayName("image exception is handled")
    void imageExceptionIsHandled() {
        //Given
        ReasonCode reasonCode = ReasonCode.IMAGE_EXCEPTION;
        String errorMessage = "Error message";
        ImageException exception = new ImageException(reasonCode, errorMessage);
        when(errorMapper.toResponse(exception.getResponse())).thenReturn(new HandlerErrorResponse(
                exception.getResponse().info(),
                exception.getResponse().error(),
                exception.getResponse().warning()
        ));

        //When
        HandlerErrorResponse handlerErrorResponse = exceptionHandler.imageException(exception);

        //Then
        assertThat(handlerErrorResponse.error()).hasSizeGreaterThan(0)
                .allMatch(error -> error.reasonCode().reasonStatus() == reasonCode.reasonStatus())
                .allMatch(error -> error.reasonCode() == reasonCode)
                .allMatch(error -> error.message().equals(errorMessage));
    }

    @Test
    @DisplayName("bad credentials is handled")
    void badCredentialsIsHandled() {
        //Given
        ReasonCode reasonCode = ReasonCode.BAD_CREDENTIALS_ERROR;
        String errorMessage = "Error message";
        BadCredentialsException exception = new BadCredentialsException(errorMessage);
        when(errorMapper.toResponse(any())).thenReturn(new HandlerErrorResponse(
                new ArrayList<>(),
                List.of(new ResultEntry(ReasonCode.BAD_CREDENTIALS_ERROR.reasonStatus(), ReasonCode.BAD_CREDENTIALS_ERROR, errorMessage)),
                new ArrayList<>()
        ));

        //When
        HandlerErrorResponse handlerErrorResponse = exceptionHandler.badCredentialsException(exception);

        //Then
        assertThat(handlerErrorResponse.error()).hasSizeGreaterThan(0)
                .allMatch(error -> error.reasonCode().reasonStatus() == reasonCode.reasonStatus())
                .allMatch(error -> error.reasonCode() == reasonCode)
                .allMatch(error -> error.message().equals(errorMessage));
    }

    @Test
    @DisplayName("generic exception is handled")
    void genericExceptionIsHandled() {
        //Given
        ReasonCode reasonCode = ReasonCode.INTERNAL_SERVER_ERROR;
        String errorMessage = "Error message";
        GenericRuntimeException exception = new GenericRuntimeException(reasonCode, errorMessage);
        when(errorMapper.toResponse(exception.getResponse())).thenReturn(new HandlerErrorResponse(
                exception.getResponse().info(),
                exception.getResponse().error(),
                exception.getResponse().warning()
        ));

        //When
        HandlerErrorResponse handlerErrorResponse = exceptionHandler.genericRuntimeException(exception);

        //Then
        assertThat(handlerErrorResponse.error()).hasSizeGreaterThan(0)
                .allMatch(error -> error.reasonCode().reasonStatus() == reasonCode.reasonStatus())
                .allMatch(error -> error.reasonCode() == reasonCode)
                .allMatch(error -> error.message().equals(errorMessage));
    }
}
