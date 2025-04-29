import React, {ReactNode} from 'react';
import ActionsBar from "../components/storefront/header/ActionsBar.componenet";
import SiteFooter from "../components/storefront/footer/SiteFooter.component";
import FooterDetails from "../components/storefront/footer/FooterDetails.component";
import {Separator} from "../components/ui/separator";
import SiteHeader from "../components/storefront/header/SiteHeader";
import MenuBar from "../components/storefront/header/MenuBar.component";

interface LayoutProps {
    children: ReactNode;
}

const StorefrontLayout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="flex flex-col min-h-screen scrollbar">
            <header>
                <SiteHeader/>
                <ActionsBar/>
                <Separator/>
                <MenuBar/>
            </header>

            <Separator/>

            <main className="flex-1 h-full flex items-center justify-center">
                {children}
            </main>

            <Separator/>

            <footer>
                <FooterDetails/>
                <SiteFooter/>
            </footer>
        </div>
    );
};

export default StorefrontLayout;