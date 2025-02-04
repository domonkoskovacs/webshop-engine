import {AuthServiceApi} from "../shared/api";
import {handleApiError} from "../shared/ApiError";
import {ApiConfig} from "../shared/ApiConfig";

class AuthService {
    private authApi: AuthServiceApi

    constructor() {
        this.authApi = new AuthServiceApi(ApiConfig.getConfig());
    }

    /**
     * Logs in a user and returns the login information.
     * @param email
     * @param password
     */
    async login(email: string, password: string) {
        try {
            return (await this.authApi.login({loginRequest: {email, password}})).data
        } catch (error) {
            handleApiError(error)
        }
    }

    /**
     * Refresh login information with the refresh token
     * @param token
     */
    async refresh(token: string) {
        try {
            return (await this.authApi.refreshToken({tokenRequest: {token}}, {withCredentials: true})).data;
        } catch (error) {
            handleApiError(error);
        }
    }

}

export const authService = new AuthService();
