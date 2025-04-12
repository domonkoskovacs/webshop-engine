import {ArticleServiceApi, ArticleServiceApiCreate4Request} from "../shared/api";
import {handleApiCall} from "../shared/ApiCall";
import {ApiBaseService} from "../shared/ApiBaseService";

class ArticleService extends ApiBaseService<ArticleServiceApi> {
    constructor() {
        super(ArticleServiceApi);
    }

    /**
     * Get all article
     */
    async getAll() {
        return handleApiCall(() =>
            this.api.getAll3()
                .then(res => res?.data)
        );
    }

    /**
     * Create an article
     * @param article
     */
    async create(article: ArticleServiceApiCreate4Request) {
        return handleApiCall(() =>
            this.api.create4(article)
                .then(res => res?.data)
        );
    }

    /**
     * Delete an article by id
     * @param id
     */
    async delete(id: string) {
        return handleApiCall(() =>
            this.api.delete3({id})
                .then(res => res?.data)
        );
    }

}

export const articleService = new ArticleService();
