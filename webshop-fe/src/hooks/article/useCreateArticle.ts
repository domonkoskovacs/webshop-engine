import {useMutation, useQueryClient} from '@tanstack/react-query';
import {articleService} from '@/services/ArticleService';
import {ArticleResponse, ArticleServiceApiCreate4Request} from "@/shared/api";
import {ApiError} from "@/shared/ApiError.ts";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useCreateArticle = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAuthGuard();

    return useMutation<ArticleResponse, ApiError, ArticleServiceApiCreate4Request>({
        mutationFn: async (data) => {
            assertAdmin();
            return articleService.create(data);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['articles']});
        },
    });
};
