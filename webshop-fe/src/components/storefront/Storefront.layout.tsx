import React, {ReactNode} from 'react';
import HomeBar from "./homebar/HomeBar.componenet";

interface LayoutProps {
    children: ReactNode;
}

const StorefrontLayout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="shrink-0 border-b border-border">
                <HomeBar/>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-2">
                {children}
            </main>

            <footer className="shrink-0 border-t border-border bg-muted p-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Your Store. All rights reserved.
            </footer>
        </div>
    );
};

export default StorefrontLayout;
