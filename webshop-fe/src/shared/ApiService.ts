import {
    AuthServiceApi,
    CategoryResponse, CategoryServiceApi,
    Configuration,
    LoginRequest,
    RegistrationRequest,
    UserServiceApi
} from "./api";

class ApiService {
    private authApi: AuthServiceApi;
    private userApi: UserServiceApi;
    private categoryApi: CategoryServiceApi;
    private readonly config: Configuration;

    constructor() {
        this.config = new Configuration({
            basePath: 'http://localhost:8080',
        });
        this.authApi = new AuthServiceApi(this.config);
        this.userApi = new UserServiceApi(this.config);
        this.categoryApi = new CategoryServiceApi(this.config);
    }

    async login(loginRequest: LoginRequest) {
        try {
            const response = await this.authApi.login({
                loginRequest: loginRequest
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async register(registrationRequest: RegistrationRequest) {
        try {
            const response = await this.userApi.register({
                registrationRequest: registrationRequest
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async getAllCategories()  {
        try {
            const response = await this.categoryApi.getAll3();
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    async deleteCategory(id: string)  {
        try {
            const response = await this.categoryApi.delete2({
                id: id
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export const apiService = new ApiService();
