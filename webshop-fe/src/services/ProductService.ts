import {
    ProductServiceApi,
    ProductServiceApiCreateRequest,
    ProductServiceApiExportRequest,
    ProductServiceApiGetAllRequest,
    ProductServiceApiUpdateRequest
} from "../shared/api";
import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";

class ProductService {
    private productApi: ProductServiceApi

    constructor() {
        this.productApi = new ProductServiceApi(ApiConfig.getConfig());
    }

    /**
     * Create a product
     */
    async create(productRequest: ProductServiceApiCreateRequest) {
        return handleApiCall(() =>
            this.productApi.create(productRequest)
                .then(res => res?.data)
        );
    }

    /**
     * Get all product by filters
     */
    async getAll(productRequest: ProductServiceApiGetAllRequest) {
        return handleApiCall(() =>
            this.productApi.getAll(productRequest)
                .then(res => res?.data)
        );
    }

    /**
     * Get a product by id
     */
    async getById(id: string) {
        return handleApiCall(() =>
            this.productApi.getById({id})
                .then(res => res?.data)
        );
    }

    /**
     * Get all brands
     */
    async getBrands() {
        return handleApiCall(() =>
            this.productApi.getBrands()
                .then(res => res?.data)
        );
    }

    /**
     * Delete a product
     */
    async delete(id: string) {
        return handleApiCall(() =>
            this.productApi._delete({id})
                .then(res => res?.data)
        );
    }

    /**
     * Update a product
     */
    async update(productRequest: ProductServiceApiUpdateRequest) {
        return handleApiCall(() =>
            this.productApi.update(productRequest)
                .then(res => res?.data)
        );
    }

    /**
     * Set discount on a product
     */
    async discount(id: string, discount: number) {
        return handleApiCall(() =>
            this.productApi.setDiscount({discountRequest: {id, discount}})
                .then(res => res?.data)
        );
    }

    /**
     * Import products from csv
     */
    async import(csv: string) {
        return handleApiCall(() =>
            this.productApi.importProducts({csvRequest: {csv}})
                .then(res => res?.data)
        );
    }

    /**
     * Export products in csv
     */
    async export(exportRequest: ProductServiceApiExportRequest) {
        return handleApiCall(() =>
            this.productApi._export(exportRequest)
                .then(res => res?.data)
        );
    }
}

export const productService = new ProductService();
