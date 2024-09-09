package hu.webshop.engine.webshopbe.domain.base.exception;

import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;

public class AuthenticationException extends GenericRuntimeException {

    public AuthenticationException(ReasonCode reasonCode, String message) {
        super(reasonCode, message);
    }
}
