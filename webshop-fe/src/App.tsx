import React from 'react';
import AppRouter from "./routing/AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "./components/ui/Toaster";
import ScrollToTop from "./routing/ScrollToTop";
import Providers from "./contexts/Providers";
import {TooltipProvider} from './components/ui/Tooltip';

function App() {
    return (
        <Router>
            <ScrollToTop/>
            <ThemeProvider>
                <TooltipProvider>
                    <Providers>
                        <AppRouter/>
                        <Toaster/>
                    </Providers>
                </TooltipProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
