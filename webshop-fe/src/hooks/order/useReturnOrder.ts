import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/OrderService";
import { OrderResponse } from "../../shared/api";
import { ApiError } from "../../shared/ApiError";
import { toast } from "../UseToast";
import { useUserGuard } from "../useUserGuard";

export const useReturnOrder = () => {
    const queryClient = useQueryClient();
    const { assertUser } = useUserGuard();

    return useMutation<OrderResponse, ApiError, string>({
        mutationFn: async (id: string) => {
            assertUser();
            return await orderService.returnOrder(id);
        },
        onSuccess: async (updatedOrder) => {
            toast({ description: "Order return requested successfully." });

            queryClient.setQueryData<OrderResponse[]>(["orders"], (prev) =>
                prev?.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)) ?? []
            );
        },
    });
};
