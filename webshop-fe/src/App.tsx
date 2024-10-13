import React from 'react';
import AppRouter from "./AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";
import {AuthProvider} from "./contexts/AuthContext";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "./components/ui/Toaster";

function App() {
    return (
        <Router>
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
