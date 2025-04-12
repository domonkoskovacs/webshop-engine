import { useMutation } from "@tanstack/react-query";
import { orderService } from "../../services/OrderService";
import { ApiError } from "../../shared/ApiError";
import { PaymentIntentResponse } from "../../shared/api";

export const useCreatePaymentIntent = () =>
    useMutation<{ clientSecret: string }, ApiError, string>({
        mutationFn: async (orderId: string) => {
            const result: PaymentIntentResponse = await orderService.paymentIntent(orderId);

            if (!result.clientSecret) {
                throw new Error("Missing client secret from payment intent");
            }

            return { clientSecret: result.clientSecret };
        },
    });
