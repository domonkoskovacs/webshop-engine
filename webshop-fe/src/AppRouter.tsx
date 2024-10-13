import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Forbidden from './pages/Forbidden.page';
import Home from './pages/Home.page';
import NotFound from './pages/NotFound.page';
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

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>

            {/*todo protect these routes*/}
            <Route
                path="/admin/dashboard/*"
                element={
                    <AdminDashboardLayout>
                        <Routes>
                            <Route path="article" element={<ArticleDashboard />} />
                            <Route path="category" element={<CategoryDashboard />} />
                            <Route path="promotion-email" element={<PromotionEmailDashboard />} />
                            <Route path="orders" element={<OrdersDashboard />} />
                            <Route path="products" element={<ProductsDashboard />} />
                            <Route path="statistics" element={<StatisticsDashboard />} />
                            <Route path="store" element={<StoreDashboard />} />
                            <Route path="settings" element={<SettingsDashboard />} />
                        </Routes>
                    </AdminDashboardLayout>
                }
            />
            <Route path="/403" element={<Forbidden/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
};

export default AppRouter;
