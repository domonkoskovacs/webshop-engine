import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {OrderResponse, OrderServiceApiGetAll4Request, OrderStatusRequestOrderStatusEnum} from "../shared/api";
import {orderService} from "../services/OrderService";
import {downloadCSV} from "../lib/file.utils";
import {toast} from "../hooks/UseToast";
import {countOrdersNeedingAttention} from "../lib/order.utils";

interface OrderContextType {
    orders: OrderResponse[];
    filters: OrderServiceApiGetAll4Request;
    updateFilters: (newFilters: Partial<OrderServiceApiGetAll4Request>) => void;
    resetFilters: () => void;
    totalPages: number;
    nextPage: () => void;
    prevPage: () => void;
    setPage: (page: number) => void;
    changeStatus: (id: string, status: OrderStatusRequestOrderStatusEnum) => Promise<void>;
    exportOrders: (from: string, to: string) => Promise<void>;
    priceRange: number[];
    totalElements: number;
    ordersNeedingAttention: number;
}

export const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
    children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({children}) => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [filters, setFilters] = useState<OrderServiceApiGetAll4Request>({
        page: 1,
        size: 10,
    });
    const [totalPages, setTotalPages] = useState(1);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [totalElements, setTotalElements] = useState(1);
    const [ordersNeedingAttention, setOrdersNeedingAttention] = useState(0);

    const fetchOrders = useCallback(async () => {
        try {
            const data = await orderService.getAll({...filters, page: filters.page! - 1});
            if (data.content) setOrders(data.content);
            setTotalPages(data.totalPages ?? 0);
            setPriceRange([data.minPrice ?? 0, data.maxPrice ?? 0])
            setTotalElements(data.totalElements ?? 0);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Error fetching products. Please try again.",
            });
        }
    }, [filters]);

    useEffect(() => {
        (async () => {
            await fetchOrders();
        })();
    }, [fetchOrders]);

    useEffect(() => {
        setOrdersNeedingAttention(countOrdersNeedingAttention(orders));
    }, [orders]);

    const updateFilters = (newFilters: Partial<OrderServiceApiGetAll4Request>) => {
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
                exportOrders,
                priceRange,
                totalElements,
                ordersNeedingAttention
            }}>
            {children}
        </OrderContext.Provider>
    );
};