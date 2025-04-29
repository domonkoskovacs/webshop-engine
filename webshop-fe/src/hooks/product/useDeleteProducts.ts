import { useMutation, useQueryClient } from "@tanstack/react-query";
import {useAuthGuard} from "../useAuthGuard";
import {ApiError} from "@/shared/ApiError.ts";
import {productService} from "@/services/ProductService.ts";

export const useDeleteProducts = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAuthGuard();

    return useMutation<void, ApiError, string[]>({
        mutationFn: async (ids) => {
            assertAdmin();
            return productService.delete(ids);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};
