import {useMutation, useQueryClient} from "@tanstack/react-query";
import {orderService} from "@/services/OrderService.ts";
import {ApiError} from "@/shared/ApiError.ts";
import {RefundOrderItemRequest} from "@/shared/api";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useRefundOrder = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAuthGuard();

    return useMutation<void, ApiError, { id: string; refund: RefundOrderItemRequest[] }>({
        mutationFn: async ({id, refund}) => {
            assertAdmin()
            await orderService.createRefund(id, refund);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["orders"]});
        },
    });
};
