import {AuthServiceApi} from "../shared/api";
import {handleApiCall} from "../shared/ApiCall";
import {ApiBaseService} from "../shared/ApiBaseService";

class AuthService extends ApiBaseService<AuthServiceApi> {
    constructor() {
        super(AuthServiceApi);
    }

    /**
     * Logs in a user and returns the login information.
     * @param email
     * @param password
     */
    async login(email: string, password: string) {
        return handleApiCall(() =>
            this.api.login({loginRequest: {email, password}})
                .then(res => res?.data)
        );
    }

    /**
     * Refresh login information with the refresh token
     * @param token
     */
    async refresh(token: string) {
        return handleApiCall(() =>
            this.api.refreshToken({tokenRequest: {token}}, {withCredentials: true})
                .then(res => res?.data)
        );
    }

}

export const authService = new AuthService();
