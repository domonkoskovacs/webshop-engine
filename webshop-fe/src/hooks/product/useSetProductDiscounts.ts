import { useMutation, useQueryClient } from "@tanstack/react-query";
import {useAdminGuard} from "../useAdminGuard";
import {ApiError} from "../../shared/ApiError";
import {Discount} from "../../shared/api";
import {productService} from "../../services/ProductService";

export const useSetProductDiscounts = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAdminGuard();

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
