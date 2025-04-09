import React from "react";
import {AuthProvider} from "./AuthContext";
import {GenderProvider} from "./GenderContext";
import {UserProvider} from "./UserContext";
import {ProductProvider} from "./ProductContext";
import {ProductInfiniteScrollProvider} from "./ProductInfiniteScrollContext";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({children}) => {
    return (
        <AuthProvider>
            <GenderProvider>
                <UserProvider>
                    <ProductProvider>
                        <ProductInfiniteScrollProvider>
                            {children}
                        </ProductInfiniteScrollProvider>
                    </ProductProvider>
                </UserProvider>
            </GenderProvider>
        </AuthProvider>
    );
};

export default Providers;
