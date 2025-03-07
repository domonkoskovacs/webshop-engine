import React, { createContext, useState, ReactNode } from "react";
import {OrderResponse} from "../shared/api";

interface OrderContextType {
    orders: OrderResponse[];
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
    children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    return (
        <OrderContext.Provider value={{ orders }}>
            {children}
        </OrderContext.Provider>
    );
};