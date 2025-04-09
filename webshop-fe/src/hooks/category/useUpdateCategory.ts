import {useMutation, useQueryClient} from "@tanstack/react-query";
import {categoryService} from "../../services/CategoryService";
import {useAdminGuard} from "../useAdminGuard";
import {ApiError} from "../../shared/ApiError";
import {CategoryResponse} from "../../shared/api";

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAdminGuard();

    return useMutation<CategoryResponse, ApiError, { id: string; name: string }>({
        mutationFn: async ({ id, name }) => {
            assertAdmin();
            return categoryService.update(id, name);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};