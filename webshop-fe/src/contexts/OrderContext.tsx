import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {OrderResponse, OrderServiceApiGetAll1Request, OrderStatusRequestOrderStatusEnum} from "../shared/api";
import {orderService} from "../services/OrderService";
import {downloadCSV} from "../lib/csv.downloader";

interface OrderContextType {
    orders: OrderResponse[];
    filters: OrderServiceApiGetAll1Request;
    updateFilters: (newFilters: Partial<OrderServiceApiGetAll1Request>) => void;
    resetFilters: () => void;
    totalPages: number;
    nextPage: () => void;
    prevPage: () => void;
    setPage: (page: number) => void;
    changeStatus: (id: string, status: OrderStatusRequestOrderStatusEnum) => Promise<void>;
    exportOrders: (from: string, to: string) => Promise<void>;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
    children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({children}) => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [filters, setFilters] = useState<OrderServiceApiGetAll1Request>({
        page: 1,
        size: 10,
    });
    const [totalPages, setTotalPages] = useState(1);

    const fetchOrders = useCallback(async () => {
        const data = await orderService.getAll({...filters, page: filters.page! - 1});
        if (data.content) setOrders(data.content);
        setTotalPages(data.totalPages ?? 0);
    }, [filters]);

    useEffect(() => {
        (async () => {
            await fetchOrders();
        })();
    }, [fetchOrders]);

    const updateFilters = (newFilters: Partial<OrderServiceApiGetAll1Request>) => {
        setFilters((prev) => ({...prev, ...newFilters, page: 1}));
    };

    const resetFilters = () => {
        setFilters({page: 1, size: 10});
    };

    const nextPage = () => {
        if (filters.page && filters.page < totalPages) {
            setFilters((prev) => ({...prev, page: prev.page! + 1}));
        }
    };

    const prevPage = () => {
        if (filters.page && filters.page > 1) {
            setFilters((prev) => ({...prev, page: prev.page! - 1}));
        }
    };

    const setPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setFilters((prev) => ({...prev, page}));
        }
    };

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
            const response = await orderService.export(from, to)
            if (response.csv) {
                downloadCSV(response.csv, "orders.csv");
            }
        } catch (error) {
            throw error
        }
    };

    return (
        <OrderContext.Provider
            value={{
                orders,
                filters,
                updateFilters,
                resetFilters,
                totalPages,
                nextPage,
                prevPage,
                setPage,
                changeStatus,
                exportOrders
            }}>
            {children}
        </OrderContext.Provider>
    );
};