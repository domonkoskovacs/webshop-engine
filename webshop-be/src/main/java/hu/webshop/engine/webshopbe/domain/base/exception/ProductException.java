package hu.webshop.engine.webshopbe.domain.base.exception;

import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;

public class ProductException extends GenericRuntimeException {

    public ProductException(ReasonCode reasonCode, String message) {
        super(reasonCode, message);
    }
}
