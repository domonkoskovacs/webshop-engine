import {AuthServiceApi, Configuration, LoginRequest} from "./api";

class ApiService {
    private api: AuthServiceApi;
    private readonly config: Configuration;

    constructor() {
        this.config = new Configuration({
            basePath: 'http://localhost:8080',
        });
        this.api = new AuthServiceApi(this.config);
    }

    async login(loginRequest: LoginRequest) {
        try {
            const response = await this.api.login({
                loginRequest: loginRequest
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export const apiService = new ApiService();
