import {useMutation, useQueryClient} from "@tanstack/react-query";
import {categoryService} from "../../services/CategoryService";
import {useAdminGuard} from "../useAdminGuard";
import {ApiError} from "../../shared/ApiError";

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAdminGuard();

    return useMutation<void, ApiError, string>({
        mutationFn: async (id) => {
            assertAdmin();
            return categoryService.delete(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};