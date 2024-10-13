// src/Router.tsx
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import Home from './pages/Home.component';
import NotFound from './pages/NotFound.component';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
        </Router>
    );
};

export default AppRouter;
