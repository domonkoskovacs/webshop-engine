package hu.webshop.engine.webshopbe.domain.base.exception;


import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;

public class PaymentException extends GenericRuntimeException {

    public PaymentException(ReasonCode reasonCode, String message) {
        super(reasonCode, message);
    }
}
