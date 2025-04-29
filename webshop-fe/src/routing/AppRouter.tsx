import React from 'react';
import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import Home from '../pages/storefront/Home.page';
import NotFound from '../pages/storefront/NotFound.page';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboardLayout from "../layouts/AdminDashboard.layout";
import ArticleDashboard from "../pages/admin/ArticleDashboard.page";
import CategoryDashboard from "../pages/admin/CategoryDashboard.page";
import PromotionEmailDashboard from "../pages/admin/PromotionEmailDashboard.page";
import OrdersDashboard from "../pages/admin/OrdersDashboard.page";
import ProductsDashboard from "../pages/admin/ProductsDashboard.page";
import StatisticsDashboard from "../pages/admin/StatisticsDashboard.page";
import StoreDashboard from "../pages/admin/StoreDashboard.page";
import StorefrontLayout from "../layouts/Storefront.layout";
import ForgotPassword from "../pages/storefront/ForgotPassword.page";
import NewPassword from "../pages/storefront/NewPassword.page";
import VerifyEmailConfirmation from "../pages/storefront/VerifyEmailConfirm.page";
import PrivacyPolicy from "../pages/storefront/PrivacyPolicy.page";
import TermsAndConditions from "../pages/storefront/TermsAndConditions.page";
import Authentication from "../pages/storefront/Authentication.page";
import AboutUs from "../pages/storefront/AboutUs.page";
import FrequentlyAskedQuestions from '../pages/storefront/FrequentlyAskedQuestions.page';
import ContactUs from "../pages/storefront/ContactUs.page";
import Products from "../pages/storefront/Products.page";
import Saved from "../pages/storefront/Saved.page";
import Cart from "../pages/storefront/Cart.page";
import Profile from "../pages/storefront/Profile.page";
import PreviousOrders from "../pages/storefront/PreviousOrders.page";
import Checkout from "../pages/storefront/Checkout.page";
import VerifyEmailResend from "../pages/storefront/VerifyEmailResend.page";
import UnsubscribeEmailList from "../pages/storefront/UnsubscribeEmailList.page";
import CheckoutPayment from "../pages/storefront/CheckoutPayment.page";
import {AppPaths} from "./AppPaths";

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route
                element={
                    <StorefrontLayout>
                        <Outlet/>
                    </StorefrontLayout>
                }
            >
                {/* Public routes */}
                <Route path={AppPaths.HOME} element={<Home/>}/>
                <Route path={AppPaths.PRODUCTS} element={<Products/>}/>
                <Route path={AppPaths.SAVED_PRODUCTS} element={<Saved/>}/>
                <Route path={AppPaths.CART_ITEMS} element={<Cart/>}/>
                <Route path={AppPaths.AUTHENTICATION} element={<Authentication/>}/>
                <Route path={AppPaths.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
                <Route path={AppPaths.NEW_PASSWORD} element={<NewPassword/>}/>
                <Route path={AppPaths.VERIFY_EMAIL} element={<VerifyEmailResend/>}/>
                <Route path={AppPaths.VERIFY_EMAIL_CONFIRM} element={<VerifyEmailConfirmation/>}/>
                <Route path={AppPaths.PRIVACY_POLICY} element={<PrivacyPolicy/>}/>
                <Route path={AppPaths.TERMS} element={<TermsAndConditions/>}/>
                <Route path={AppPaths.ABOUT} element={<AboutUs/>}/>
                <Route path={AppPaths.FAQ} element={<FrequentlyAskedQuestions/>}/>
                <Route path={AppPaths.CONTACT} element={<ContactUs/>}/>
                <Route path={AppPaths.UNSUBSCRIBE_EMAIL} element={<UnsubscribeEmailList/>}/>
                <Route path={AppPaths.NOT_FOUND} element={<NotFound/>}/>

                <Route
                    element={
                        <ProtectedRoute allowedRole="ROLE_USER">
                            <Outlet/>
                        </ProtectedRoute>
                    }
                >
                    {/* Protected storefront routes */}
                    <Route path={AppPaths.PROFILE} element={<Profile/>}/>
                    <Route path={AppPaths.MY_ORDERS} element={<PreviousOrders/>}/>
                    <Route path={AppPaths.CHECKOUT} element={<Checkout/>}/>
                </Route>
            </Route>

            {/* Protected payment route */}
            <Route
                path={AppPaths.CHECKOUT_PAYMENT}
                element={
                    <ProtectedRoute allowedRole="ROLE_USER">
                        <CheckoutPayment/>
                    </ProtectedRoute>
                }
            />

            <Route
                path={AppPaths.DASHBOARD}
                element={
                    <ProtectedRoute allowedRole="ROLE_ADMIN">
                        <AdminDashboardLayout>
                            <Outlet/>
                        </AdminDashboardLayout>
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to={AppPaths.DASHBOARD_ARTICLES} replace/>}/>
                {/* Protected admin routes */}
                <Route path={AppPaths.DASHBOARD_ARTICLES} element={<ArticleDashboard/>}/>
                <Route path={AppPaths.DASHBOARD_CATEGORIES} element={<CategoryDashboard/>}/>
                <Route path={AppPaths.DASHBOARD_PROMOTION_EMAIL} element={<PromotionEmailDashboard/>}/>
                <Route path={AppPaths.DASHBOARD_ORDERS} element={<OrdersDashboard/>}/>
                <Route path={AppPaths.DASHBOARD_PRODUCTS} element={<ProductsDashboard/>}/>
                <Route path={AppPaths.DASHBOARD_STATISTICS} element={<StatisticsDashboard/>}/>
                <Route path={AppPaths.DASHBOARD_STORE} element={<StoreDashboard/>}/>
            </Route>
        </Routes>
    );
};

export default AppRouter;
