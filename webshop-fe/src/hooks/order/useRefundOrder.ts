import {useMutation, useQueryClient} from "@tanstack/react-query";
import {orderService} from "../../services/OrderService";
import {ApiError} from "../../shared/ApiError";
import {RefundOrderItemRequest} from "../../shared/api";

export const useRefundOrder = () => {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, { id: string; refund: RefundOrderItemRequest[] }>({
        mutationFn: async ({id, refund}) => {
            await orderService.createRefund(id, refund);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["orders"]});
        },
    });
};
