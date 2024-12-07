import React from 'react';
import {Outlet, Route, Routes} from 'react-router-dom';
import Forbidden from './pages/storefront/Forbidden.page';
import Home from './pages/storefront/Home.page';
import NotFound from './pages/storefront/NotFound.page';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboardLayout from "./components/admin/AdminDashboard.layout";
import ArticleDashboard from "./pages/admin/ArticleDashboard.page";
import CategoryDashboard from "./pages/admin/CategoryDashboard.page";
import PromotionEmailDashboard from "./pages/admin/PromotionEmailDashboard.page";
import OrdersDashboard from "./pages/admin/OrdersDashboard.page";
import ProductsDashboard from "./pages/admin/ProductsDashboard.page";
import StatisticsDashboard from "./pages/admin/StatisticsDashboard.page";
import StoreDashboard from "./pages/admin/StoreDashboard.page";
import SettingsDashboard from "./pages/admin/SettingsDashboard.page";
import StorefrontLayout from "./components/storefront/Storefront.layout";
import ForgotPassword from "./pages/storefront/ForgotPassword.page";
import NewPassword from "./pages/storefront/NewPassword.page";
import VerifyEmail from "./pages/storefront/VerifyEmail.page";

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
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/new-password" element={<NewPassword/>}/>
                <Route path="/verify-email" element={<VerifyEmail/>}/>
                <Route path="/403" element={<Forbidden/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Route>

            <Route
                path="/admin/dashboard/*"
                element={
                    <ProtectedRoute allowedRole="ROLE_ADMIN">
                        <AdminDashboardLayout>
                            <Outlet/>
                        </AdminDashboardLayout>
                    </ProtectedRoute>
                }
            >
                {/* Protected admin routes */}
                <Route path="article" element={<ArticleDashboard/>}/>
                <Route path="category" element={<CategoryDashboard/>}/>
                <Route path="promotion-email" element={<PromotionEmailDashboard/>}/>
                <Route path="orders" element={<OrdersDashboard/>}/>
                <Route path="products" element={<ProductsDashboard/>}/>
                <Route path="statistics" element={<StatisticsDashboard/>}/>
                <Route path="store" element={<StoreDashboard/>}/>
                <Route path="settings" element={<SettingsDashboard/>}/>
            </Route>
        </Routes>
    );
};

export default AppRouter;
