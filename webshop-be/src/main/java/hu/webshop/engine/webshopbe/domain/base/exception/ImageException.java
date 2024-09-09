package hu.webshop.engine.webshopbe.domain.base.exception;

import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;

public class ImageException extends GenericRuntimeException {
    public ImageException(ReasonCode reasonCode, String message) {
        super(reasonCode, message);
    }
}
