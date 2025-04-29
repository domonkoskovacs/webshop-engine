import {useQuery} from "@tanstack/react-query";
import {OrderResponse} from "@/shared/api";
import {orderService} from "@/services/OrderService.ts";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useUserOrders = () => {
    const {isUser} = useAuthGuard()

    const {data: orders = [], isLoading} = useQuery<OrderResponse[]>({
        queryKey: ["orders"],
        queryFn: async () => orderService.getAllUser(),
        enabled: isUser
    });

    const isOrdered = (productId: string): boolean => {
        return orders.some(order =>
            order.items?.some(item => item.productId === productId)
        );
    };

    return {orders, isOrdered, isLoading};
};