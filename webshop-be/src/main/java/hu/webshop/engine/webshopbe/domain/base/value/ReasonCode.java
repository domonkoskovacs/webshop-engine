package hu.webshop.engine.webshopbe.domain.base.value;

import java.util.EnumMap;

public enum ReasonCode {
    INTERNAL_SERVER_ERROR,
    TECHNICAL_ERROR,
    VALIDATION_ERROR,
    BAD_CREDENTIALS_ERROR,
    JWT_EXPIRED_ERROR,
    BAD_TOKEN_FORMAT_ERROR,
    UNVERIFIED_USER,
    ALREADY_VERIFIED_USER,
    BAD_REFRESH_TOKEN,
    EMAIL_TAKEN,
    UNAUTHENTICATED_USER,
    BAD_TOKEN,
    ACCESS_DENIED,
    WRONG_PASSWORD,
    EMAIL_NOT_EXISTS,
    EMAIL_EXCEPTION,
    IMAGE_EXCEPTION,
    STRIPE_EXCEPTION,
    ORDER_EXCEPTION,
    NOT_FOUND,
    NO_SHIPPING_ADDRESS,
    NO_BILLING_ADDRESS,
    NO_ITEMS_IN_CART,
    NOT_ENOUGH_PRODUCT_IN_STOCK,
    INVALID_ORDER_PRICE,
    CSV_ERROR,
    CSV_UPLOAD_ERROR,
    PROMOTION_EMAIL_NAME_OCCUPIED;

    private static final EnumMap<ReasonCode, Integer> reasonStatus = new EnumMap<>(ReasonCode.class);

    static {
        reasonStatus.put(INTERNAL_SERVER_ERROR, 5001);
        reasonStatus.put(TECHNICAL_ERROR, 5002);
        reasonStatus.put(EMAIL_EXCEPTION, 5003);
        reasonStatus.put(VALIDATION_ERROR, 4001);
        reasonStatus.put(IMAGE_EXCEPTION, 4002);
        reasonStatus.put(BAD_CREDENTIALS_ERROR, 4011);
        reasonStatus.put(JWT_EXPIRED_ERROR, 4012);
        reasonStatus.put(BAD_TOKEN_FORMAT_ERROR, 4013);
        reasonStatus.put(UNVERIFIED_USER, 4014);
        reasonStatus.put(BAD_REFRESH_TOKEN, 4015);
        reasonStatus.put(WRONG_PASSWORD, 4016);
        reasonStatus.put(EMAIL_NOT_EXISTS, 4017);
        reasonStatus.put(UNAUTHENTICATED_USER, 4018);
        reasonStatus.put(BAD_TOKEN, 4019);
        reasonStatus.put(ACCESS_DENIED, 4031);
        reasonStatus.put(EMAIL_TAKEN, 4042);
        reasonStatus.put(STRIPE_EXCEPTION, 4020);
        reasonStatus.put(ORDER_EXCEPTION, 4003);
        reasonStatus.put(NOT_FOUND, 4040);
        reasonStatus.put(NO_SHIPPING_ADDRESS, 4004);
        reasonStatus.put(NO_BILLING_ADDRESS, 4005);
        reasonStatus.put(NO_ITEMS_IN_CART, 4006);
        reasonStatus.put(NOT_ENOUGH_PRODUCT_IN_STOCK, 4007);
        reasonStatus.put(INVALID_ORDER_PRICE, 4008);
        reasonStatus.put(CSV_ERROR, 5004);
        reasonStatus.put(CSV_UPLOAD_ERROR, 4009);
        reasonStatus.put(PROMOTION_EMAIL_NAME_OCCUPIED, 40010);
        reasonStatus.put(ALREADY_VERIFIED_USER, 40011);
    }

    public int reasonStatus() {
        return reasonStatus.get(this);
    }
}
