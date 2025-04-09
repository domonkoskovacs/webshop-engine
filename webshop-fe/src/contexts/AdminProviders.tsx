import React from "react";
import {OrderProvider} from "./OrderContext";
import {StoreProvider} from "./StoreContext";
import {StatisticsProvider} from "./StatisticsContext";

interface AdminProvidersProps {
    children: React.ReactNode;
}

const AdminProviders: React.FC<AdminProvidersProps> = ({children}) => {
    return (
        <StoreProvider>
            <OrderProvider>
                <StatisticsProvider>
                    {children}
                </StatisticsProvider>
            </OrderProvider>
        </StoreProvider>
    );
};

export default AdminProviders;
