import React from 'react';
import AppRouter from "./AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";
import {AuthProvider} from "./contexts/AuthContext";

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppRouter/>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
