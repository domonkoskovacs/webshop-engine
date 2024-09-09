package hu.webshop.engine.webshopbe.domain.base.exception;


import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;

public class StripeException extends GenericRuntimeException {

    public StripeException(ReasonCode reasonCode, String message) {
        super(reasonCode, message);
    }
}
