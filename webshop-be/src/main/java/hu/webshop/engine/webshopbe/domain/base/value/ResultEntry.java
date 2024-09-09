package hu.webshop.engine.webshopbe.domain.base.value;

public record ResultEntry(int ReasonStatus, ReasonCode reasonCode, String message) {
    public static ResultEntry resultEntry(ReasonCode reasonCode, String message) {
        return new ResultEntry(reasonCode.reasonStatus(), reasonCode, message);
    }
}
