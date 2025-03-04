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
import {GenderProvider} from "./contexts/GenderContext";
import {ProductInfiniteScrollProvider} from "./contexts/ProductInfiniteScrollContext";
import {UserProvider} from "./contexts/UserContext";

function App() {
    return (
        <Router>
            <ScrollToTop/>
            <ThemeProvider>
                <AuthProvider>
                    <GenderProvider>
                        <UserProvider>
                            <CategoryProvider>
                                <ProductProvider>
                                    <ProductInfiniteScrollProvider>
                                        <ArticleProvider>
                                            <AppRouter/>
                                            <Toaster/>
                                        </ArticleProvider>
                                    </ProductInfiniteScrollProvider>
                                </ProductProvider>
                            </CategoryProvider>
                        </UserProvider>
                    </GenderProvider>
                </AuthProvider>
            </ThemeProvider>
        </Router>
    );
}

export default App;
