import React from 'react';
import AppRouter from "./routing/AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";
import {AuthProvider} from "./contexts/AuthContext";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "./components/ui/Toaster";
import ScrollToTop from "./routing/ScrollToTop";

function App() {
    return (
        <Router>
            <ScrollToTop />
            <ThemeProvider>
                <AuthProvider>
                    <AppRouter/>
                    <Toaster />
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
