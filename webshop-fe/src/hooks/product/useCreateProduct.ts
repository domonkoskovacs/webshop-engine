import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuthGuard} from "../useAuthGuard";
import {ProductResponse, ProductServiceApiCreate1Request} from "@/shared/api";
import {ApiError} from "@/shared/ApiError.ts";
import {productService} from "@/services/ProductService.ts";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAuthGuard();

    return useMutation<ProductResponse, ApiError, ProductServiceApiCreate1Request>({
        mutationFn: async (data) => {
            assertAdmin();
            return productService.create(data);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["products"]});
        },
    });
};
