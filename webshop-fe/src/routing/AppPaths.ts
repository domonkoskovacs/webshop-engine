export const AppPathsBase = {
    // User routes
    HOME: '/',
    PRODUCTS: '/products/*',
    SAVED_PRODUCTS: '/saved-products',
    CART_ITEMS: '/cart-items',
    AUTHENTICATION: '/authentication',
    FORGOT_PASSWORD: '/forgot-password',
    NEW_PASSWORD: '/new-password',
    VERIFY_EMAIL: '/verify-email',
    VERIFY_EMAIL_CONFIRM: '/verify-email/confirm',
    UNSUBSCRIBE_EMAIL: '/unsubscribe',

    PRIVACY_POLICY: '/privacy-policy',
    TERMS: '/terms-and-conditions',
    ABOUT: '/about-us',
    FAQ: '/faq',
    CONTACT: '/contact',
    NOT_FOUND: '*',

    // Protected user routes
    PROFILE: '/profile',
    MY_ORDERS: '/my-orders',
    CHECKOUT: '/checkout',
    CHECKOUT_PAYMENT: '/checkout-payment',

    // Admin dashboard routes
    DASHBOARD: '/dashboard/*',
    DASHBOARD_BASE: '/dashboard',
    DASHBOARD_ARTICLES: 'articles',
    DASHBOARD_CATEGORIES: 'categories',
    DASHBOARD_PROMOTION_EMAIL: 'promotion-emails',
    DASHBOARD_ORDERS: 'orders',
    DASHBOARD_PRODUCTS: 'products',
    DASHBOARD_STATISTICS: 'statistics',
    DASHBOARD_STORE: 'store',
};

export const AppPaths = {
    ...AppPathsBase,

    // Full dashboard routes
    DASHBOARD_ARTICLES_FULL: `${AppPathsBase.DASHBOARD_BASE}/${AppPathsBase.DASHBOARD_ARTICLES}`,
    DASHBOARD_CATEGORIES_FULL: `${AppPathsBase.DASHBOARD_BASE}/${AppPathsBase.DASHBOARD_CATEGORIES}`,
    DASHBOARD_PROMOTION_EMAIL_FULL: `${AppPathsBase.DASHBOARD_BASE}/${AppPathsBase.DASHBOARD_PROMOTION_EMAIL}`,
    DASHBOARD_ORDERS_FULL: `${AppPathsBase.DASHBOARD_BASE}/${AppPathsBase.DASHBOARD_ORDERS}`,
    DASHBOARD_PRODUCTS_FULL: `${AppPathsBase.DASHBOARD_BASE}/${AppPathsBase.DASHBOARD_PRODUCTS}`,
    DASHBOARD_STATISTICS_FULL: `${AppPathsBase.DASHBOARD_BASE}/${AppPathsBase.DASHBOARD_STATISTICS}`,
    DASHBOARD_STORE_FULL: `${AppPathsBase.DASHBOARD_BASE}/${AppPathsBase.DASHBOARD_STORE}`,
};
