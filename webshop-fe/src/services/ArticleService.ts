import {ArticleServiceApi, ArticleServiceApiCreate4Request} from "../shared/api";
import {ApiBaseService} from "../shared/ApiBaseService";
import axiosInstance from "../lib/axios";

class ArticleService extends ApiBaseService<ArticleServiceApi> {
    constructor() {
        super(ArticleServiceApi, axiosInstance);
    }

    /**
     * Get all article
     */
    async getAll() {
        return this.api.getAll3().then(res => res?.data)
    }

    /**
     * Create an article
     * @param article
     */
    async create(article: ArticleServiceApiCreate4Request) {
        return this.api.create4(article).then(res => res?.data)
    }

    /**
     * Delete an article by id
     * @param id
     */
    async delete(id: string) {
        return this.api.delete3({id}).then(res => res?.data)
    }

}

export const articleService = new ArticleService();
