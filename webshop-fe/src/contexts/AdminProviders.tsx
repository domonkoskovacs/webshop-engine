import React from "react";
import {OrderProvider} from "./OrderContext";
import {StoreProvider} from "./StoreContext";

interface AdminProvidersProps {
    children: React.ReactNode;
}

const AdminProviders: React.FC<AdminProvidersProps> = ({children}) => {
    return (
        <StoreProvider>
            <OrderProvider>
                {children}
            </OrderProvider>
        </StoreProvider>
    );
};

export default AdminProviders;
