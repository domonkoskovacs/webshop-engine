import AppRouter from "./routing/AppRouter";
import {BrowserRouter as Router} from 'react-router-dom';
import ScrollToTop from "./routing/ScrollToTop";
import {TooltipProvider} from './components/ui/tooltip';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Toaster} from "./components/ui/sonner";
import {CookiesProvider} from "react-cookie";
import {GenderProvider} from "@/contexts/GenderProvider.tsx";
import {AuthProvider} from "@/contexts/AuthProvider.tsx";
import {ThemeProvider} from "@/contexts/ThemeProvider.tsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <CookiesProvider>
                <Router>
                    <ScrollToTop/>
                    <ThemeProvider>
                        <AuthProvider>
                            <GenderProvider>
                                <TooltipProvider>
                                    <AppRouter/>
                                    <Toaster
                                        position="bottom-center"
                                        richColors
                                        closeButton
                                        duration={4000}
                                        expand
                                    />
                                </TooltipProvider>
                            </GenderProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </Router>
            </CookiesProvider>
        </QueryClientProvider>
    );
}

export default App
