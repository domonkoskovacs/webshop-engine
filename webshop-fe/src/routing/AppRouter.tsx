import React from 'react';
import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import Forbidden from '../pages/storefront/Forbidden.page';
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
import FrequentlyAskedQuestions from 'src/pages/storefront/FrequentlyAskedQuestions.page';
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
                <Route path="/" element={<Home/>}/>
                <Route path="/products/*" element={<Products/>}/>
                <Route path="/saved" element={<Saved/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/authentication" element={<Authentication/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/new-password" element={<NewPassword/>}/>
                <Route path="/verify-email" element={<VerifyEmailResend/>}/>
                <Route path="/verify-email/confirm" element={<VerifyEmailConfirmation/>}/>
                <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
                <Route path="/about-us" element={<AboutUs/>}/>
                <Route path="/faq" element={<FrequentlyAskedQuestions/>}/>
                <Route path="/contact" element={<ContactUs/>}/>
                <Route path="/unsubcribe" element={<UnsubscribeEmailList/>}/>
                <Route path="/403" element={<Forbidden/>}/>
                <Route path="*" element={<NotFound/>}/>

                <Route
                    element={
                        <ProtectedRoute allowedRole="ROLE_USER">
                            <Outlet/>
                        </ProtectedRoute>
                    }
                >
                    {/* Protected storefront routes */}
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/previous-orders" element={<PreviousOrders/>}/>
                    <Route path="/checkout" element={<Checkout/>}/>
                </Route>
            </Route>

            {/* Protected payment route */}
            <Route
                path="/checkout-payment"
                element={
                    <ProtectedRoute allowedRole="ROLE_USER">
                        <CheckoutPayment/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/*"
                element={
                    <ProtectedRoute allowedRole="ROLE_ADMIN">
                            <AdminDashboardLayout>
                                <Outlet/>
                            </AdminDashboardLayout>
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="article" replace />} />
                {/* Protected admin routes */}
                <Route path="article" element={<ArticleDashboard/>}/>
                <Route path="category" element={<CategoryDashboard/>}/>
                <Route path="promotion-email" element={<PromotionEmailDashboard/>}/>
                <Route path="orders" element={<OrdersDashboard/>}/>
                <Route path="products" element={<ProductsDashboard/>}/>
                <Route path="statistics" element={<StatisticsDashboard/>}/>
                <Route path="store" element={<StoreDashboard/>}/>
            </Route>
        </Routes>
    );
};

export default AppRouter;
