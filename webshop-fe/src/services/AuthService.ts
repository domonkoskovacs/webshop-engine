import {AuthServiceApi} from "@/shared/api";
import {ApiBaseService} from "../shared/ApiBaseService";
import axiosInstance from "../lib/axios";

class AuthService extends ApiBaseService<AuthServiceApi> {
    constructor() {
        super(AuthServiceApi, axiosInstance);
    }

    /**
     * Logs in a user and returns the login information.
     * @param email
     * @param password
     */
    async login(email: string, password: string) {
        return this.api.login({loginRequest: {email, password}}).then(res => res?.data)
    }

    /**
     * Refresh login information with the refresh token
     * @param token
     */
    async refresh(token: string) {
        return this.api.refreshToken({tokenRequest: {token}}, {withCredentials: true}).then(res => res?.data)
    }

}

export const authService = new AuthService();
