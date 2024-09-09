package hu.webshop.engine.webshopbe.domain.base.exception;

import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;

public class OrderException extends GenericRuntimeException {
    public OrderException(ReasonCode reasonCode, String message) {
        super(reasonCode, message);
    }
}
