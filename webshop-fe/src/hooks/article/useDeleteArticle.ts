import {useMutation, useQueryClient} from '@tanstack/react-query';
import {articleService} from '@/services/ArticleService';
import {ApiError} from "@/shared/ApiError.ts";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useDeleteArticle = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAuthGuard();

    return useMutation<void, ApiError, string>({
        mutationFn: async (id) => {
            assertAdmin();
            return articleService.delete(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['articles']});
        },
    });
};
