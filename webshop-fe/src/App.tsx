import React from 'react';
import AppRouter from "./routing/AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "./components/ui/Toaster";
import ScrollToTop from "./routing/ScrollToTop";
import Providers from "./contexts/Providers";
import {TooltipProvider} from './components/ui/Tooltip';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
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
            {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}

export default App;
