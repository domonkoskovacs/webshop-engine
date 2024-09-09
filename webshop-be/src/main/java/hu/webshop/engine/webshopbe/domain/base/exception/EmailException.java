package hu.webshop.engine.webshopbe.domain.base.exception;

import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;

public class EmailException extends GenericRuntimeException {
    public EmailException(ReasonCode reasonCode, String message) {
        super(reasonCode, message);
    }
}
