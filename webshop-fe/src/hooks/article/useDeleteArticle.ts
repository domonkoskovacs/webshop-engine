import {useMutation, useQueryClient} from '@tanstack/react-query';
import {articleService} from 'src/services/ArticleService';
import {ApiError} from "../../shared/ApiError";
import {useAdminGuard} from "../useAdminGuard";

export const useDeleteArticle = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAdminGuard();

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
