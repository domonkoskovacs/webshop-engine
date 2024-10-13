// src/Router.tsx
import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home.page';
import NotFound from './pages/NotFound.page';
import AdminDashboard from "./pages/AdminDashboard.page";

const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    );
};

export default AppRouter;
