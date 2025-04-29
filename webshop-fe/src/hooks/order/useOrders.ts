import {OrderPageOrderResponse, OrderServiceApiGetAll4Request} from "@/shared/api";
import {useAuthGuard} from "../useAuthGuard";
import {useQuery} from "@tanstack/react-query";
import {orderService} from "@/services/OrderService.ts";

export const useOrders = (filters: OrderServiceApiGetAll4Request) => {
    const { isAdmin } = useAuthGuard();
    return useQuery<OrderPageOrderResponse, Error, OrderPageOrderResponse, [string, OrderServiceApiGetAll4Request]>({
        queryKey: ["orders", filters],
        queryFn: async () => {
            return await orderService.getAll({
                ...filters,
                page: filters.page ? filters.page - 1 : 0,
            });
        },
        placeholderData: (prevData) => prevData,
        enabled: isAdmin,
    });
};