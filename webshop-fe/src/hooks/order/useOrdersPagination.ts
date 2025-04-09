import {useCallback, useState} from "react";
import {OrderServiceApiGetAll4Request} from "../../shared/api";
import {countOrdersNeedingAttention} from "../../lib/order.utils";
import {useOrders} from "./useOrders";

export const useOrdersPagination = () => {
    const [filters, setFilters] = useState<OrderServiceApiGetAll4Request>({page: 1, size: 10});
    const ordersQuery = useOrders(filters);

    const updateFilters = useCallback((newFilters: Partial<OrderServiceApiGetAll4Request>) => {
        setFilters((prev) => ({...prev, ...newFilters, page: 1}));
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({page: 1, size: 10});
    }, []);

    const nextPage = useCallback(() => {
        if (
            filters.page &&
            ordersQuery.data &&
            filters.page < (ordersQuery.data.totalPages ?? 1)
        ) {
            setFilters((prev) => ({...prev, page: (prev.page || 1) + 1}));
        }
    }, [filters, ordersQuery.data]);

    const prevPage = useCallback(() => {
        if (filters.page && filters.page > 1) {
            setFilters((prev) => ({...prev, page: (prev.page || 1) - 1}));
        }
    }, [filters]);

    const setPage = useCallback(
        (page: number) => {
            if (
                page >= 1 &&
                ordersQuery.data &&
                page <= (ordersQuery.data.totalPages ?? 1)
            ) {
                setFilters((prev) => ({...prev, page}));
            }
        },
        [ordersQuery.data]
    );

    return {
        orders: ordersQuery.data?.content ?? [],
        filters,
        updateFilters,
        resetFilters,
        totalPages: ordersQuery.data?.totalPages ?? 0,
        nextPage,
        prevPage,
        setPage,
        priceRange: ordersQuery.data
            ? [ordersQuery.data.minPrice ?? 0, ordersQuery.data.maxPrice ?? 0]
            : [0, 0],
        totalElements: ordersQuery.data?.totalElements ?? 0,
        ordersNeedingAttention: ordersQuery.data
            ? countOrdersNeedingAttention(ordersQuery.data.content ?? [])
            : 0,
        isLoading: ordersQuery.isLoading,
        isError: ordersQuery.isError,
        error: ordersQuery.error,
    };
};