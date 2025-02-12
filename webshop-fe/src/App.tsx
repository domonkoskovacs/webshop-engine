import React from 'react';
import AppRouter from "./routing/AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";
import {AuthProvider} from "./contexts/AuthContext";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "./components/ui/Toaster";
import ScrollToTop from "./routing/ScrollToTop";
import {CategoryProvider} from "./contexts/CategoryContext";

function App() {
    return (
        <Router>
            <ScrollToTop/>
            <ThemeProvider>
                <AuthProvider>
                    <CategoryProvider>
                        <AppRouter/>
                        <Toaster/>
                    </CategoryProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
