import {RegistrationRequestGenderEnum, UserServiceApi} from "../shared/api";
import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";

class UserService {
    private userApi: UserServiceApi

    constructor() {
        this.userApi = new UserServiceApi(ApiConfig.getConfig());
    }

    /**
     * Registers a new user
     */
    async register(
        email: string,
        firstname: string,
        lastname: string,
        password: string,
        phoneNumber: string,
        gender: string | undefined,
        subscribedToEmail: boolean | undefined
    ) {
        const genderEnum = gender === "men"
            ? RegistrationRequestGenderEnum.Male
            : gender === "women"
                ? RegistrationRequestGenderEnum.Female
                : undefined;
        return handleApiCall(() =>
            this.userApi.register({
                registrationRequest: {
                    email,
                    firstname,
                    lastname,
                    password,
                    phoneNumber,
                    gender: genderEnum,
                    subscribedToEmail,
                },
            }).then(res => res?.data)
        );
    }

    /**
     * Sends forgotten password email
     * @param email
     */
    async sendForgotPasswordEmail(email: string) {
        return handleApiCall(() =>
            this.userApi.forgottenPassword({forgottenPasswordRequest: {email}})
                .then(res => res?.data)
        );
    }

    /**
     * Set new password for the user
     * @param id
     * @param password
     */
    async newPassword(id: string, password: string) {
        return handleApiCall(() =>
            this.userApi.newPassword({newPasswordRequest: {id, password}})
                .then(res => res?.data)
        );
    }

    /**
     * Verify email
     * @param id
     */
    async verifyEmail(id: string) {
        return handleApiCall(() =>
            this.userApi.verify({verificationRequest: {id}})
                .then(res => res?.data)
        );
    }

}

export const userService = new UserService();
