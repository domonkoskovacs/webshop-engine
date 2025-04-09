import React from "react";
import {AuthProvider} from "./AuthContext";
import {GenderProvider} from "./GenderContext";
import {UserProvider} from "./UserContext";
import {ProductProvider} from "./ProductContext";
import {ProductInfiniteScrollProvider} from "./ProductInfiniteScrollContext";
import {PublicStoreProvider} from "./PublicStoreContext";

interface ProvidersProps {
    children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({children}) => {
    return (
        <PublicStoreProvider>
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
        </PublicStoreProvider>
    );
};

export default Providers;
