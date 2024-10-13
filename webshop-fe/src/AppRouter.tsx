// src/Router.tsx
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import Home from './pages/Home.page';
import NotFound from './pages/NotFound.page';
import AdminDashboard from "./pages/AdminDashboard.page";

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </Router>
    );
};

export default AppRouter;
