import {useMutation, useQueryClient} from "@tanstack/react-query";
import {categoryService} from "src/services/CategoryService";
import {useAdminGuard} from "../useAdminGuard";
import {CategoryResponse} from "../../shared/api";
import {ApiError} from "../../shared/ApiError";

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAdminGuard();

    return useMutation<CategoryResponse, ApiError, string>({
        mutationFn: async (request) => {
            assertAdmin();
            return categoryService.create(request);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['categories']});
        },
    });
};