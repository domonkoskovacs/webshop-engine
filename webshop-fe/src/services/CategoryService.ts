import {CategoryServiceApi} from "../shared/api";
import {handleApiError} from "../shared/ApiError";
import {ApiConfig} from "../shared/ApiConfig";

class CategoryService {
    private categoryApi: CategoryServiceApi

    constructor() {
        this.categoryApi = new CategoryServiceApi(ApiConfig.getConfig());
    }

    /**
     * Lists all categories.
     */
    async getAll() {
        try {
            return (await this.categoryApi.getAll3()).data
        } catch (error) {
            handleApiError(error)
        }
    }

    /**
     * Get category by id
     * @param id
     */
    async getById(id: string) {
        try {
            return (await this.categoryApi.getById2({id: id})).data;
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * Create category
     */
    async create(name: string) {
        try {
            return (await this.categoryApi.create3({categoryRequest: {name}})).data;
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * Add subcategory to a category
     */
    async addSubCategory(id: string, name: string) {
        try {
            return (await this.categoryApi.addSubCategory({id: id, categoryRequest: {name}})).data;
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * Updates a category
     */
    async update(id: string, name: string) {
        try {
            return (await this.categoryApi.update1({id: id, categoryRequest: {name}})).data;
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * Deletes a category
     */
    async delete(id: string) {
        try {
            return (await this.categoryApi.delete2({id: id})).data;
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * Deletes a subCategory
     */
    async deleteSubCategory(id: string) {
        try {
            return (await this.categoryApi.deleteSubCategory({id: id})).data;
        } catch (error) {
            handleApiError(error);
        }
    }

}

export const categoryService = new CategoryService();
