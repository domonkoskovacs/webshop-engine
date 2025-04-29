import {useQuery} from "@tanstack/react-query";
import {articleService} from "@/services/ArticleService";
import {ArticleResponse} from "@/shared/api";
import {ApiError} from "@/shared/ApiError.ts";

export const useArticles = () => {
    return useQuery<ArticleResponse[], ApiError>({
        queryKey: ['articles'],
        queryFn: () => articleService.getAll(),
    });
};
