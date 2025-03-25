import {ArticleServiceApi, ArticleServiceApiCreate4Request} from "../shared/api";
import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";

class ArticleService {
    private articleApi: ArticleServiceApi

    constructor() {
        this.articleApi = new ArticleServiceApi(ApiConfig.getConfig());
    }

    /**
     * Get all article
     */
    async getAll() {
        return handleApiCall(() =>
            this.articleApi.getAll3()
                .then(res => res?.data)
        );
    }

    /**
     * Create an article
     * @param article
     */
    async create(article: ArticleServiceApiCreate4Request) {
        return handleApiCall(() =>
            this.articleApi.create4(article)
                .then(res => res?.data)
        );
    }

    /**
     * Delete an article by id
     * @param id
     */
    async delete(id: string) {
        return handleApiCall(() =>
            this.articleApi.delete3({id})
                .then(res => res?.data)
        );
    }

}

export const articleService = new ArticleService();
