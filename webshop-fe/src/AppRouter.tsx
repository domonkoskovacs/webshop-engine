// src/Router.tsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard.page';
import Forbidden from './pages/Forbidden.page';
import Home from './pages/Home.page';
import NotFound from './pages/NotFound.page';
import ProtectedRoute from './ProtectedRoute';

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin/dashboard" element = {
                <ProtectedRoute allowedRole="ROLE_ADMIN">
                    <AdminDashboard />
                </ProtectedRoute>
            }/>
            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
};

export default AppRouter;
