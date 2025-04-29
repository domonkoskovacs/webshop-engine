import {useMutation, useQueryClient} from "@tanstack/react-query";
import {orderService} from "@/services/OrderService.ts";
import {OrderResponse} from "@/shared/api";
import {ApiError} from "@/shared/ApiError.ts";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    const {assertUser} = useAuthGuard();

    return useMutation<OrderResponse, ApiError, void>({
        mutationFn: async () => {
            assertUser();
            return await orderService.create();
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["orders"]}),
                queryClient.invalidateQueries({queryKey: ["cart"]}),
            ]);
        },
    });
};
