import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuthGuard} from "../useAuthGuard";
import {ProductResponse, ProductServiceApiUpdateRequest} from "@/shared/api";
import {ApiError} from "@/shared/ApiError.ts";
import {productService} from "@/services/ProductService.ts";

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAuthGuard();

    return useMutation<ProductResponse, ApiError, ProductServiceApiUpdateRequest>({
        mutationFn: async (data) => {
            assertAdmin();
            return productService.update(data);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["products"]});
        },
    });
};
