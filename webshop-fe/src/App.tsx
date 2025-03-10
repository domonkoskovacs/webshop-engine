import React from 'react';
import AppRouter from "./routing/AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "./components/ui/Toaster";
import ScrollToTop from "./routing/ScrollToTop";
import Providers from "./contexts/Providers";
import {Elements} from "@stripe/react-stripe-js";
import {stripePromise} from "./lib/stripe.utils";

function App() {
    return (
        <Router>
            <ScrollToTop/>
            <ThemeProvider>
                <Elements stripe={stripePromise}>
                    <Providers>
                        <AppRouter/>
                        <Toaster/>
                    </Providers>
                </Elements>
            </ThemeProvider>
        </Router>
    );
}

export default App;
