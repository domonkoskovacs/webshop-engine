import {useMutation, useQueryClient} from "@tanstack/react-query";
import {orderService} from "@/services/OrderService.ts";
import {ApiError} from "@/shared/ApiError.ts";
import {OrderResponse} from "@/shared/api";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useCancelOrder = () => {
    const queryClient = useQueryClient();
    const {assertUser} = useAuthGuard();

    return useMutation<OrderResponse, ApiError, string>({
        mutationFn: async (id: string) => {
            assertUser();
            return await orderService.cancel(id);
        },
        onSuccess: async (updatedOrder) => {
            queryClient.setQueryData<OrderResponse[]>(["orders"], (prev) =>
                prev?.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)) ?? []
            );
        },
    });
};
