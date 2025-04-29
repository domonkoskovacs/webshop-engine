import {useMutation} from "@tanstack/react-query";
import {orderService} from "@/services/OrderService.ts";
import {ApiError} from "@/shared/ApiError.ts";
import {PaymentIntentResponse} from "@/shared/api";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useCreatePaymentIntent = () => {
    const {assertUser} = useAuthGuard();

    return useMutation<{ clientSecret: string }, ApiError, string>({
        mutationFn: async (orderId: string) => {
            assertUser()
            const result: PaymentIntentResponse = await orderService.paymentIntent(orderId);

            if (!result.clientSecret) {
                throw new Error("Missing client secret from payment intent");
            }

            return {clientSecret: result.clientSecret};
        },
    });
}

