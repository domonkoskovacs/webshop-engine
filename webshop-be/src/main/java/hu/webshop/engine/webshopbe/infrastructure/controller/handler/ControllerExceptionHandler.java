package hu.webshop.engine.webshopbe.infrastructure.controller.handler;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import hu.webshop.engine.webshopbe.domain.base.exception.AuthenticationException;
import hu.webshop.engine.webshopbe.domain.base.exception.CsvException;
import hu.webshop.engine.webshopbe.domain.base.exception.EmailException;
import hu.webshop.engine.webshopbe.domain.base.exception.GenericRuntimeException;
import hu.webshop.engine.webshopbe.domain.base.exception.ImageException;
import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.exception.ProductException;
import hu.webshop.engine.webshopbe.domain.base.exception.RegistrationException;
import hu.webshop.engine.webshopbe.domain.base.exception.PaymentException;
import hu.webshop.engine.webshopbe.domain.base.value.HandlerErrorModel;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.base.value.ResultEntry;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.HandlerErrorMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ErrorResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
@ResponseBody
@RequiredArgsConstructor
public class ControllerExceptionHandler extends ResponseEntityExceptionHandler {

    private final HandlerErrorMapper mapper;

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, @NonNull HttpHeaders headers, @NonNull HttpStatusCode status, @NonNull WebRequest request) {
        HandlerErrorModel handlerErrorModel = new HandlerErrorModel();
        List<ResultEntry> errors = ex.getBindingResult().getAllErrors().stream().map(ObjectError::toString).map(errorMessage -> new ResultEntry(ReasonCode.VALIDATION_ERROR.reasonStatus(), ReasonCode.VALIDATION_ERROR, errorMessage)).toList();
        handlerErrorModel.addErrors(errors);
        return new ResponseEntity<>(mapper.toResponse(handlerErrorModel), HttpStatus.BAD_REQUEST);
    }

    /**
     * Csv exception
     * Returns 500
     */
    @ExceptionHandler(CsvException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse csvException(CsvException ce) {
        return mapper.toResponse(ce.getResponse());
    }

    /**
     * Product exception
     * Returns 400
     */
    @ExceptionHandler(EmailException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse emailException(EmailException ee) {
        return mapper.toResponse(ee.getResponse());
    }

    /**
     * Product exception
     * Returns 400
     */
    @ExceptionHandler(ProductException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse productException(ProductException pe) {
        return mapper.toResponse(pe.getResponse());
    }

    /**
     * Order exception
     * Returns 400
     */
    @ExceptionHandler(OrderException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse orderException(OrderException oe) {
        return mapper.toResponse(oe.getResponse());
    }

    /**
     * Stripe payment exception
     * Returns 402
     */
    @ExceptionHandler(PaymentException.class)
    @ResponseStatus(HttpStatus.PAYMENT_REQUIRED)
    public ErrorResponse stripeException(PaymentException nse) {
        return mapper.toResponse(nse.getResponse());
    }

    /**
     * Bad image exception
     * Returns 400
     */
    @ExceptionHandler(ImageException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse imageException(ImageException i) {
        return mapper.toResponse(i.getResponse());
    }

    /**
     * Entity not found exception
     * Returns 404
     */
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse entityNotFoundException(EntityNotFoundException ee) {
        HandlerErrorModel handlerErrorModel = new HandlerErrorModel();
        handlerErrorModel.addError(new ResultEntry(ReasonCode.NOT_FOUND.reasonStatus(), ReasonCode.NOT_FOUND, ee.getMessage()));
        return mapper.toResponse(handlerErrorModel);
    }

    /**
     * Authentication exception
     * Returns 403, handles invalid jwt tokens
     */
    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse badCredentialsException(BadCredentialsException bce) {
        HandlerErrorModel handlerErrorModel = new HandlerErrorModel();
        handlerErrorModel.addError(new ResultEntry(ReasonCode.BAD_CREDENTIALS_ERROR.reasonStatus(), ReasonCode.BAD_CREDENTIALS_ERROR, bce.getMessage()));
        return mapper.toResponse(handlerErrorModel);
    }

    /**
     * Registration exception, thrown if username or email is taken
     * Returns 400
     */
    @ExceptionHandler(RegistrationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse registrationException(RegistrationException re) {
        return mapper.toResponse(re.getResponse());
    }

    /**
     * Authentication exception
     * Returns 401, every auth flow exception considered to be this error
     */
    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorResponse authenticationException(AuthenticationException ae) {
        return mapper.toResponse(ae.getResponse());
    }

    /**
     * Generic runtime exception
     * Only holds current error
     */
    @ExceptionHandler(GenericRuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse genericRuntimeException(GenericRuntimeException ge) {
        log.error("generic exception", ge);
        return mapper.toResponse(ge.getResponse());
    }

    /**
     * Access denied return 403
     */
    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ErrorResponse accessDeniedException(AccessDeniedException ade) {
        log.error("access denied", ade);
        HandlerErrorModel handlerErrorModel = new HandlerErrorModel();
        handlerErrorModel.addError(new ResultEntry(ReasonCode.ACCESS_DENIED.reasonStatus(), ReasonCode.ACCESS_DENIED, ade.getMessage()));
        return mapper.toResponse(handlerErrorModel);
    }

    /**
     * General runtime exception
     * Only holds current error
     */
    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse runtimeException(RuntimeException e) {
        log.error("unexpected error", e);
        HandlerErrorModel handlerErrorModel = new HandlerErrorModel();
        handlerErrorModel.addError(new ResultEntry(ReasonCode.INTERNAL_SERVER_ERROR.reasonStatus(), ReasonCode.INTERNAL_SERVER_ERROR, e.getMessage()));
        return mapper.toResponse(handlerErrorModel);
    }
}
