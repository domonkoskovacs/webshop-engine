import React from 'react';
import AppRouter from "./routing/AppRouter";
import {ThemeContext} from "./contexts/ThemeContext";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "./components/ui/Toaster";
import ScrollToTop from "./routing/ScrollToTop";
import {TooltipProvider} from './components/ui/Tooltip';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {AuthProvider} from "./contexts/AuthContext";
import {GenderProvider} from './contexts/GenderContext';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <ScrollToTop/>
                <ThemeContext>
                    <AuthProvider>
                        <GenderProvider>
                            <TooltipProvider>
                                <AppRouter/>
                                <Toaster/>
                            </TooltipProvider>
                        </GenderProvider>
                    </AuthProvider>
                </ThemeContext>
            </Router>
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false}/>}
        </QueryClientProvider>
    );
}

export default App;
