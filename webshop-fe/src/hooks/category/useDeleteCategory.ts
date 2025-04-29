import {useMutation, useQueryClient} from "@tanstack/react-query";
import {categoryService} from "@/services/CategoryService.ts";
import {ApiError} from "@/shared/ApiError.ts";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAuthGuard();

    return useMutation<void, ApiError, string>({
        mutationFn: async (id) => {
            assertAdmin();
            return categoryService.delete(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['categories']});
        },
    });
};