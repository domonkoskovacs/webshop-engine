import React from 'react';
import AppRouter from "./AppRouter";
import {ThemeProvider} from "./contexts/theme-provider";

function App() {
    return (
        <div>
            <ThemeProvider>
                <AppRouter/>
            </ThemeProvider>
        </div>
    );
}

export default App;
