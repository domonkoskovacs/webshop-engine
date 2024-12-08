import React, {ReactNode} from 'react';
import HomeBar from "./homebar/HomeBar.componenet";
import Footer from "./Footer.component";
import FooterDetails from "./FooterDetails.component";
import {Separator} from "../ui/Separator";

interface LayoutProps {
    children: ReactNode;
}

const StorefrontLayout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen scrollbar">
            <header>
                <HomeBar/>
            </header>

            <main className="flex-1 px-4 py-2">
                {children}
            </main>

            <Separator/>
            <FooterDetails/>
            <Footer/>
        </div>
    );
};

export default StorefrontLayout;