import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/OrderService";
import { OrderResponse } from "../../shared/api";
import { ApiError } from "../../shared/ApiError";
import { useUserGuard } from "../useUserGuard";

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const { assertUser } = useUserGuard();

    return useMutation<OrderResponse, ApiError, void>({
        mutationFn: async () => {
            assertUser();
            return await orderService.create();
        },
        onSuccess: async (order) => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["orders"] }),
                queryClient.invalidateQueries({ queryKey: ["cart"] }),
            ]);
        },
    });
};
