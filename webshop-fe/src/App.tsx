import React from 'react';
import AppRouter from "./routing/AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";
import {AuthProvider} from "./contexts/AuthContext";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "./components/ui/Toaster";
import ScrollToTop from "./routing/ScrollToTop";
import {CategoryProvider} from "./contexts/CategoryContext";
import {ProductProvider} from "./contexts/ProductContext";
import {ArticleProvider} from "./contexts/ArticleContext";

function App() {
    return (
        <Router>
            <ScrollToTop/>
            <ThemeProvider>
                <AuthProvider>
                    <CategoryProvider>
                        <ProductProvider>
                            <ArticleProvider>
                                <AppRouter/>
                                <Toaster/>
                            </ArticleProvider>
                        </ProductProvider>
                    </CategoryProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
