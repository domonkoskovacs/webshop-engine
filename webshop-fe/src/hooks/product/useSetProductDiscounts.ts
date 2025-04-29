import { useMutation, useQueryClient } from "@tanstack/react-query";
import {useAuthGuard} from "../useAuthGuard";
import {ApiError} from "@/shared/ApiError.ts";
import {Discount} from "@/shared/api";
import {productService} from "@/services/ProductService.ts";

export const useSetProductDiscounts = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAuthGuard();

    return useMutation<void, ApiError, Discount[]>({
        mutationFn: async (discounts) => {
            assertAdmin();
            return productService.setDiscounts(discounts);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};
