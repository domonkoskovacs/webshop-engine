import React from "react";
import {StoreProvider} from "./StoreContext";

interface AdminProvidersProps {
    children: React.ReactNode;
}

const AdminProviders: React.FC<AdminProvidersProps> = ({children}) => {
    return (
        <StoreProvider>
                {children}
        </StoreProvider>
    );
};

export default AdminProviders;
