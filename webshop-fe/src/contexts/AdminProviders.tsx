import React from "react";
import {EmailProvider} from "./EmailContext";
import {OrderProvider} from "./OrderContext";
import {StoreProvider} from "./StoreContext";
import {StatisticsProvider} from "./StatisticsContext";

interface AdminProvidersProps {
    children: React.ReactNode;
}

const AdminProviders: React.FC<AdminProvidersProps> = ({children}) => {
    return (
        <StoreProvider>
            <EmailProvider>
                <OrderProvider>
                    <StatisticsProvider>
                        {children}
                    </StatisticsProvider>
                </OrderProvider>
            </EmailProvider>
        </StoreProvider>
    );
};

export default AdminProviders;
