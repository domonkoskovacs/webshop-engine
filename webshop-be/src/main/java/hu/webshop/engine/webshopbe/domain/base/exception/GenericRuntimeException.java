package hu.webshop.engine.webshopbe.domain.base.exception;

import java.util.List;

import hu.webshop.engine.webshopbe.domain.base.value.HandlerErrorModel;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.base.value.ResultEntry;
import lombok.Getter;

@Getter
public class GenericRuntimeException extends RuntimeException {

    private final transient HandlerErrorModel response;

    public GenericRuntimeException(HandlerErrorModel handlerResponse) {
        this.response = handlerResponse;
    }

    public GenericRuntimeException(ReasonCode reasonCode, String message) {
        HandlerErrorModel handlerResponse = new HandlerErrorModel();
        handlerResponse.addError(ResultEntry.resultEntry(reasonCode, message));
        this.response = handlerResponse;
    }

    public GenericRuntimeException(String message) {
        HandlerErrorModel handlerResponse = new HandlerErrorModel();
        handlerResponse.addError(new ResultEntry(ReasonCode.INTERNAL_SERVER_ERROR.reasonStatus(), ReasonCode.INTERNAL_SERVER_ERROR, message));
        this.response = handlerResponse;
    }

    public GenericRuntimeException(List<ResultEntry> errors) {
        HandlerErrorModel handlerResponse = new HandlerErrorModel();
        handlerResponse.addErrors(errors);
        this.response = handlerResponse;
    }
}