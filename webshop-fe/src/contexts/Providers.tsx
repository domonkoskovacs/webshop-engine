import React from "react";
import {AuthProvider} from "./AuthContext";
import {GenderProvider} from "./GenderContext";
import {UserProvider} from "./UserContext";
import {CategoryProvider} from "./CategoryContext";
import {ProductProvider} from "./ProductContext";
import {ProductInfiniteScrollProvider} from "./ProductInfiniteScrollContext";
import {ArticleProvider} from "./ArticleContext";
import { EmailProvider } from "./EmailContext";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({children}) => {
    return (
        <AuthProvider>
            <GenderProvider>
                <UserProvider>
                    <CategoryProvider>
                        <ProductProvider>
                            <ProductInfiniteScrollProvider>
                                <ArticleProvider>
                                    <EmailProvider>
                                        {children}
                                    </EmailProvider>
                                </ArticleProvider>
                            </ProductInfiniteScrollProvider>
                        </ProductProvider>
                    </CategoryProvider>
                </UserProvider>
            </GenderProvider>
        </AuthProvider>
    );
};

export default Providers;
