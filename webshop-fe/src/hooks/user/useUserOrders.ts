import { useQuery } from "@tanstack/react-query";
import { OrderResponse } from "../../shared/api";
import { userService } from "../../services/UserService";
import { useUserGuard } from "../useUserGuard";

export const useUserOrders = () => {
    const { assertUser } = useUserGuard();

    const { data: orders = [], isLoading } = useQuery<OrderResponse[]>({
        queryKey: ["orders"],
        queryFn: async () => {
            assertUser();
            return userService.getOrders();
        },
    });

    const isOrdered = (productId: string): boolean => {
        return orders.some(order =>
            order.items?.some(item => item.productId === productId)
        );
    };

    return { orders, isOrdered, isLoading };
};