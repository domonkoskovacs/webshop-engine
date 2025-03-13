import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {
    CsvResponse,
    OrderResponse,
    OrderServiceApiGetAll1Request,
    OrderStatusRequestOrderStatusEnum
} from "../shared/api";
import {orderService} from "../services/OrderService";

interface OrderContextType {
    orders: OrderResponse[];
    filters: OrderServiceApiGetAll1Request;
    setFilters: (filters: OrderServiceApiGetAll1Request) => void;
    changeStatus: (id: string, status: OrderStatusRequestOrderStatusEnum) => Promise<void>;
    exportOrders: (from: string, to: string) => Promise<CsvResponse>;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
    children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({children}) => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [filters, setFilters] = useState<OrderServiceApiGetAll1Request>({
        page: 0,
        size: 10,
    });

    const fetchOrders = useCallback(async () => {
        const data = await orderService.getAll(filters);
        if (data.content) setOrders(data.content);
    }, [filters]);

    useEffect(() => {
        (async () => {
            await fetchOrders();
        })();
    }, [fetchOrders]);

    const changeStatus = async (id: string, status: OrderStatusRequestOrderStatusEnum) => {
        try {
            const updatedOrder = await orderService.changeStatus(id, status)

            if (updatedOrder) {
                setOrders((prevOrders) => prevOrders.map(order =>
                    order.id === id ? {...order, status} : order
                ));
            }
        } catch (error) {
            throw error
        }
    };

    const exportOrders = async (from: string, to: string) => {
        try {
            return await orderService.export(from, to)
        } catch (error) {
            throw error
        }
    };

    return (
        <OrderContext.Provider value={{orders, filters, setFilters, changeStatus, exportOrders}}>
            {children}
        </OrderContext.Provider>
    );
};