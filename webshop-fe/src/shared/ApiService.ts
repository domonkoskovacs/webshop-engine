import {
    AuthServiceApi,
    CategoryRequest,
    CategoryServiceApi,
    Configuration, ForgottenPasswordRequest,
    LoginRequest, NewPasswordRequest,
    RegistrationRequest,
    TokenRequest,
    UserServiceApi, VerificationRequest
} from "./api";
import {toast} from "../hooks/UseToast";

class ApiService {
    private authApi: AuthServiceApi;
    private userApi: UserServiceApi;
    private categoryApi: CategoryServiceApi;
    private readonly config: Configuration;

    constructor() {
        this.config = new Configuration({
            basePath: process.env.REACT_APP_BACKEND_URL,
        });
        this.authApi = new AuthServiceApi(this.config);
        this.userApi = new UserServiceApi(this.config);
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

    async login(loginRequest: LoginRequest) {
        return this.makeApiCall(() =>
            this.authApi.login({loginRequest}, {withCredentials: true}).then((res) => res.data)
        );
    }

    async refresh(tokenRequest: TokenRequest) {
        return this.makeApiCall(() =>
            this.authApi.refreshToken({tokenRequest}, {withCredentials: true}).then((res) => res.data)
        );
    }

    async register(registrationRequest: RegistrationRequest) {
        return this.makeApiCall(() =>
            this.userApi.register({registrationRequest}).then((res) => res.data)
        );
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

    async sendForgotPasswordEmail(forgottenPasswordRequest: ForgottenPasswordRequest) {
        return this.makeApiCall(() =>
            this.userApi.forgottenPassword({forgottenPasswordRequest}).then((res) => res.data)
        );
    }

    async newPassword(newPasswordRequest: NewPasswordRequest) {
        return this.makeApiCall(() =>
            this.userApi.newPassword({newPasswordRequest}).then((res) => res.data)
        );
    }

    async verifyEmail(verificationRequest: VerificationRequest) {
        return this.makeApiCall(() =>
            this.userApi.verify({verificationRequest}).then((res) => res.data)
        );
    }

    async getAllCategory() {
        return this.makeApiCall(() =>
            this.categoryApi.getAll3().then((res) => res.data)
        );
    }
}

export const apiService = new ApiService();
