import {useAuthGuard} from "../useAuthGuard";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {OrderResponse, OrderStatusRequestOrderStatusEnum} from "@/shared/api";
import {orderService} from "@/services/OrderService.ts";

export const useChangeOrderStatus = () => {
    const { assertAdmin } = useAuthGuard();
    const queryClient = useQueryClient();

    return useMutation<OrderResponse, Error, { id: string; status: OrderStatusRequestOrderStatusEnum }>({
        mutationFn: async ({ id, status }: { id: string; status: OrderStatusRequestOrderStatusEnum }) => {
            assertAdmin();
            return await orderService.changeStatus(id, status);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["orders"]});
        },
    });
};