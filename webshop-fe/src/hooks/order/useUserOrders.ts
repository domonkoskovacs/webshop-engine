import {useUserGuard} from "../useUserGuard";
import {useQuery} from "@tanstack/react-query";
import {OrderResponse} from "../../shared/api";
import {orderService} from "../../services/OrderService";

export const useUserOrders = () => {
    const {assertUser} = useUserGuard();

    const {data: orders = [], isLoading} = useQuery<OrderResponse[]>({
        queryKey: ["orders"],
        queryFn: async () => {
            assertUser();
            return orderService.getAllUser();
        },
    });

    const isOrdered = (productId: string): boolean => {
        return orders.some(order =>
            order.items?.some(item => item.productId === productId)
        );
    };

    return {orders, isOrdered, isLoading};
};