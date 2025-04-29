import {useMutation, useQueryClient} from "@tanstack/react-query";
import {categoryService} from "@/services/CategoryService";
import {CategoryResponse} from "@/shared/api";
import {ApiError} from "@/shared/ApiError.ts";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAuthGuard();

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