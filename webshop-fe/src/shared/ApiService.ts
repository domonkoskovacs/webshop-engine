import {CategoryRequest, CategoryServiceApi, Configuration} from "./api";
import {toast} from "../hooks/UseToast";

class ApiService {
    private categoryApi: CategoryServiceApi;
    private readonly config: Configuration;

    constructor() {
        this.config = new Configuration({
            basePath: process.env.REACT_APP_BACKEND_URL,
        });
        this.categoryApi = new CategoryServiceApi(this.config);
    }

    private handleError(error: any) {
        const errorData = error?.response?.data;
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: JSON.stringify(errorData ?? "An unexpected error occurred.", null, 2),
            duration: 5000,
        });
    }

    private async makeApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
        try {
            return await apiCall();
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    async getAllCategories() {
        return this.makeApiCall(() =>
            this.categoryApi.getAll3().then((res) => res.data)
        );
    }

    async deleteCategory(id: string) {
        return this.makeApiCall(() =>
            this.categoryApi.delete2({id}).then((res) => res.data)
        );
    }

    async createCategory(categoryRequest: CategoryRequest) {
        return this.makeApiCall(() =>
            this.categoryApi.create3({categoryRequest}).then((res) => res.data)
        );
    }

    async getAllCategory() {
        return this.makeApiCall(() =>
            this.categoryApi.getAll3().then((res) => res.data)
        );
    }
}

export const apiService = new ApiService();
