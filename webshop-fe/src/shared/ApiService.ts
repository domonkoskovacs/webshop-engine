import {AuthServiceApi, Configuration, LoginRequest, RegistrationRequest, UserServiceApi} from "./api";

class ApiService {
    private authApi: AuthServiceApi;
    private userApi: UserServiceApi;
    private readonly config: Configuration;

    constructor() {
        this.config = new Configuration({
            basePath: 'http://localhost:8080',
        });
        this.authApi = new AuthServiceApi(this.config);
        this.userApi = new UserServiceApi(this.config);
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
}

export const apiService = new ApiService();
