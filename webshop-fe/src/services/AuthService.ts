import {AuthServiceApi} from "../shared/api";
import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";

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
        return handleApiCall(() =>
            this.authApi.login({loginRequest: {email, password}})
                .then(res => res?.data)
        );
    }

    /**
     * Refresh login information with the refresh token
     * @param token
     */
    async refresh(token: string) {
        return handleApiCall(() =>
            this.authApi.refreshToken({tokenRequest: {token}}, {withCredentials: true})
                .then(res => res?.data)
        );
    }

}

export const authService = new AuthService();
