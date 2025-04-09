import {useMutation, useQueryClient} from "@tanstack/react-query";
import {categoryService} from "../../services/CategoryService";
import {useAdminGuard} from "../useAdminGuard";
import {CategoryResponse} from "../../shared/api";
import {ApiError} from "../../shared/ApiError";

export const useAddSubCategory = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAdminGuard();

    return useMutation<CategoryResponse, ApiError, { id: string; name: string }>({
        mutationFn: async ({ id, name }) => {
            assertAdmin();
            return categoryService.addSubCategory(id, name);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};