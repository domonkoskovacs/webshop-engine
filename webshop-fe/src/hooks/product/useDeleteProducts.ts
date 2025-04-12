import { useMutation, useQueryClient } from "@tanstack/react-query";
import {useAdminGuard} from "../useAdminGuard";
import {ApiError} from "../../shared/ApiError";
import {productService} from "../../services/ProductService";

export const useDeleteProducts = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAdminGuard();

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
