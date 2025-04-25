package hu.webshop.engine.webshopbe.infrastructure.controller.api;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class ApiPaths {

    public static final String API_BASE = "/api";
    public static final String ID = "/{id}";

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Auth {
        public static final String BASE = API_BASE + "/auth";
        public static final String LOGIN = BASE + "/login";
        public static final String REFRESH = BASE + "/refresh";
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Articles {
        public static final String BASE = API_BASE + "/articles";
        public static final String BY_ID = BASE + ID;
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Categories {
        public static final String BASE = API_BASE + "/categories";
        public static final String BY_ID = BASE + ID;
        public static final String SUBCATEGORIES = "/subcategories";
        public static final String SUBCATEGORIES_BASE = API_BASE + SUBCATEGORIES;
        public static final String SUBCATEGORY_BY_ID = SUBCATEGORIES_BASE + ID;
        public static final String CATEGORY_BY_ID_SUBCATEGORIES = BY_ID + SUBCATEGORIES;
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class PromotionEmails {
        public static final String BASE = API_BASE + "/promotion-emails";
        public static final String BY_ID = BASE + ID;
        public static final String TEST = BY_ID + "/test";
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Images {
        public static final String BASE = API_BASE + "/images";
        public static final String BY_ID = BASE + ID;
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Orders {
        public static final String BASE = API_BASE + "/orders";
        public static final String BY_ID = BASE + ID;
        public static final String CHANGE_STATUS = BY_ID + "/status";
        public static final String REFUND = BY_ID + "/refund";
        public static final String EXPORT = BASE + "/export";

        public static final String MY_BASE = API_BASE + "/my-orders";
        public static final String MY_BY_ID = MY_BASE + ID;
        public static final String CANCEL = MY_BY_ID + "/cancel";
        public static final String RETURN = MY_BY_ID + "/return";
        public static final String PAYMENT_INTENT = MY_BY_ID + "/paymentIntent";
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Products {
        public static final String BASE = API_BASE + "/products";
        public static final String BY_ID = BASE + ID;
        public static final String DELETE_BATCH = BASE + "/batch";
        public static final String BRANDS = BASE + "/brands";
        public static final String DISCOUNT = BASE + "/discount";
        public static final String IMPORT = BASE + "/import";
        public static final String EXPORT = BASE + "/export";
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Statistics {
        public static final String BASE = API_BASE + "/statistics";
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Store {
        public static final String BASE = API_BASE + "/store";
        public static final String PUBLIC = BASE + "/public";
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Webhooks {
        public static final String BASE = API_BASE + "/webhooks";
        public static final String STRIPE = BASE + "/stripe";
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class Users {
        public static final String BASE = API_BASE + "/users";
        public static final String CURRENT = BASE + "/me";
        public static final String REGISTER = BASE + "/register";
        public static final String VERIFY = BASE + "/{id}/verify";
        public static final String RESEND_VERIFICATION = BASE + "/verify/resend";
        public static final String FORGOTTEN_PASSWORD = BASE + "/password/forgotten";
        public static final String PASSWORD = BASE + "/{id}/password";
        public static final String UPDATE = BASE + "/me";
        public static final String DELETE = BASE + "/me";
        public static final String UNSUBSCRIBE = BASE + "/{id}/unsubscribe";
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class SavedProducts {
        public static final String BASE = API_BASE + "/saved-products";
    }

    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static final class CartItems {
        public static final String BASE = API_BASE + "/cart-items";
    }
}
