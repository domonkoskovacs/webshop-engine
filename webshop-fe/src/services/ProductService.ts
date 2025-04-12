import {
    Discount,
    ProductServiceApi,
    ProductServiceApiCreateRequest,
    ProductServiceApiExportRequest,
    ProductServiceApiGetAllRequest,
    ProductServiceApiUpdateRequest
} from "../shared/api";
import {ApiBaseService} from "../shared/ApiBaseService";
import axiosInstance from "../lib/axios";

class ProductService extends ApiBaseService<ProductServiceApi> {
    constructor() {
        super(ProductServiceApi, axiosInstance);
    }

    /**
     * Create a product
     */
    async create(productRequest: ProductServiceApiCreateRequest) {
        return this.api.create(productRequest).then(res => res?.data)
    }

    /**
     * Get all product by filters
     */
    async getAll(productRequest: ProductServiceApiGetAllRequest) {
        return this.api.getAll(productRequest).then(res => res?.data)
    }

    /**
     * Get a product by id
     */
    async getById(id: string) {
        return this.api.getById({id}).then(res => res?.data)
    }

    /**
     * Get all brands
     */
    async getBrands() {
        return this.api.getBrands().then(res => res?.data)
    }

    /**
     * Delete a product
     */
    async delete(ids: string[]) {
        return this.api.delete1({deleteProductRequest: {ids}}).then(res => res?.data)
    }

    /**
     * Update a product
     */
    async update(productRequest: ProductServiceApiUpdateRequest) {
        return this.api.update(productRequest).then(res => res?.data)
    }

    /**
     * Set discount on a product
     */
    async setDiscounts(discounts: Discount[]) {
        return this.api.setDiscounts({discountRequest: {discounts}}).then(res => res?.data)
    }

    /**
     * Import products from csv
     */
    async import(csv: string) {
        return this.api.importProducts({csvRequest: {csv}}).then(res => res?.data)
    }

    /**
     * Export products in csv
     */
    async export(exportRequest: ProductServiceApiExportRequest) {
        return this.api._export(exportRequest).then(res => res?.data)
    }
}

export const productService = new ProductService();
