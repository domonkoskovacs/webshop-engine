import { useMutation, useQueryClient } from "@tanstack/react-query";
import {useAdminGuard} from "../useAdminGuard";
import {ApiError} from "../../shared/ApiError";
import {productService} from "../../services/ProductService";

export const useImportProducts = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAdminGuard();

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
