import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/OrderService";
import { ApiError } from "../../shared/ApiError";
import { OrderResponse } from "../../shared/api";
import { toast } from "../UseToast";
import { useUserGuard } from "../useUserGuard";

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    const { assertUser } = useUserGuard();

    return useMutation<OrderResponse, ApiError, string>({
        mutationFn: async (id: string) => {
            assertUser();
            return await orderService.cancel(id);
        },
        onSuccess: async (updatedOrder) => {
            toast({ description: "Order cancelled successfully." });

            queryClient.setQueryData<OrderResponse[]>(["orders"], (prev) =>
                prev?.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)) ?? []
            );
        },
    });
};
