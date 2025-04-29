import {CategoryServiceApi} from "@/shared/api";
import {ApiBaseService} from "../shared/ApiBaseService";
import axiosInstance from "../lib/axios";

class CategoryService extends ApiBaseService<CategoryServiceApi> {
    constructor() {
        super(CategoryServiceApi, axiosInstance);
    }

    /**
     * Lists all categories.
     */
    async getAll() {
        return this.api.getAll2().then(res => res?.data)
    }

    /**
     * Create category
     */
    async create(name: string) {
        return this.api.create3({categoryRequest: {name}}).then(res => res?.data)
    }

    /**
     * Add subcategory to a category
     */
    async addSubCategory(id: string, name: string) {
        return this.api.addSubCategory({id: id, categoryRequest: {name}}).then(res => res?.data)
    }

    /**
     * Updates a category
     */
    async update(id: string, name: string) {
        return this.api.update1({id: id, categoryRequest: {name}}).then(res => res?.data)
    }

    /**
     * Deletes a category
     */
    async delete(id: string) {
        return this.api._delete({id: id}).then(res => res?.data)
    }

    /**
     * Deletes a subCategory
     */
    async deleteSubCategory(id: string) {
        return this.api.deleteSubCategory({id: id}).then(res => res?.data)
    }

}

export const categoryService = new CategoryService();
