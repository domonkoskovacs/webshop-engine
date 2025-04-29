import { useMutation, useQueryClient } from "@tanstack/react-query";
import {useAuthGuard} from "../useAuthGuard";
import {ApiError} from "@/shared/ApiError.ts";
import {productService} from "@/services/ProductService.ts";

export const useImportProducts = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAuthGuard();

    return useMutation<void, ApiError, string>({
        mutationFn: async (csv) => {
            assertAdmin();
            await productService.import(csv);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};
