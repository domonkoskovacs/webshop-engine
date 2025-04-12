import { useQuery } from "@tanstack/react-query";
import { OrderResponse } from "../../shared/api";
import { userService } from "../../services/UserService";
import { useUserGuard } from "../useUserGuard";

export const useOrders = () => {
    const { assertUser } = useUserGuard();

    return useQuery<OrderResponse[]>({
        queryKey: ["orders"],
        queryFn: async () => {
            assertUser();
            return userService.getOrders();
        },
    });
};
