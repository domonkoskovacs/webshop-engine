import {CategoryServiceApi} from "../shared/api";
import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";

class CategoryService {
    private categoryApi: CategoryServiceApi

    constructor() {
        this.categoryApi = new CategoryServiceApi(ApiConfig.getConfig());
    }

    /**
     * Lists all categories.
     */
    async getAll() {
        return handleApiCall(() =>
            this.categoryApi.getAll2()
                .then(res => res?.data)
        );
    }

    /**
     * Create category
     */
    async create(name: string) {
        return handleApiCall(() =>
            this.categoryApi.create3({categoryRequest: {name}})
                .then(res => res?.data)
        );
    }

    /**
     * Add subcategory to a category
     */
    async addSubCategory(id: string, name: string) {
        return handleApiCall(() =>
            this.categoryApi.addSubCategory({id: id, categoryRequest: {name}})
                .then(res => res?.data)
        );
    }

    /**
     * Updates a category
     */
    async update(id: string, name: string) {
        return handleApiCall(() =>
            this.categoryApi.update1({id: id, categoryRequest: {name}})
                .then(res => res?.data)
        );
    }

    /**
     * Deletes a category
     */
    async delete(id: string) {
        return handleApiCall(() =>
            this.categoryApi._delete({id: id})
                .then(res => res?.data)
        );
    }

    /**
     * Deletes a subCategory
     */
    async deleteSubCategory(id: string) {
        return handleApiCall(() =>
            this.categoryApi.deleteSubCategory({id: id})
                .then(res => res?.data)
        );
    }

}

export const categoryService = new CategoryService();
