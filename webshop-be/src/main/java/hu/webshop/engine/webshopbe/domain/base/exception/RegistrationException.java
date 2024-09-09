package hu.webshop.engine.webshopbe.domain.base.exception;

import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;

public class RegistrationException extends GenericRuntimeException {

    public RegistrationException(ReasonCode reasonCode, String message) {
        super(reasonCode, message);
    }
}
