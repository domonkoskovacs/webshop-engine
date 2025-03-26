import React from 'react';
import AppRouter from "./routing/AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "./components/ui/Toaster";
import ScrollToTop from "./routing/ScrollToTop";
import Providers from "./contexts/Providers";

function App() {
    return (
        <Router>
            <ScrollToTop/>
            <ThemeProvider>
                    <Providers>
                        <AppRouter/>
                        <Toaster/>
                    </Providers>
            </ThemeProvider>
        </Router>
    );
}

export default App;
