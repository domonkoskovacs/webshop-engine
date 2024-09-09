package hu.webshop.engine.webshopbe.domain.base.exception;

import java.util.List;

import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.base.value.ResultEntry;

public class CsvException extends GenericRuntimeException {

    public CsvException(ReasonCode reasonCode, String message) {
        super(reasonCode, message);
    }

    public CsvException(List<ResultEntry> errors) {
        super(errors);
    }
}
