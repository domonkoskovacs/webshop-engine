import {OrderPageOrderResponse, OrderServiceApiGetAll4Request} from "../../shared/api";
import {useAdminGuard} from "../useAdminGuard";
import {useQuery} from "@tanstack/react-query";
import {orderService} from "../../services/OrderService";

export const useOrders = (filters: OrderServiceApiGetAll4Request) => {
    const { assertAdmin } = useAdminGuard();
    return useQuery<OrderPageOrderResponse, Error, OrderPageOrderResponse, [string, OrderServiceApiGetAll4Request]>({
        queryKey: ["orders", filters],
        queryFn: async () => {
            assertAdmin();
            return await orderService.getAll({
                ...filters,
                page: filters.page ? filters.page - 1 : 0,
            });
        },
        placeholderData: (prevData) => prevData,
    });
};