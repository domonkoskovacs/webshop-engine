import {RegistrationRequestGenderEnum, UserServiceApi} from "../shared/api";
import {handleApiError} from "../shared/ApiError";
import {ApiConfig} from "../shared/ApiConfig";

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
        try {
            const genderEnum = gender === "men"
                ? RegistrationRequestGenderEnum.Male
                : gender === "women"
                    ? RegistrationRequestGenderEnum.Female
                    : undefined;

            return (
                await this.userApi.register({
                    registrationRequest: {
                        email,
                        firstname,
                        lastname,
                        password,
                        phoneNumber,
                        gender: genderEnum,
                        subscribedToEmail,
                    },
                })
            ).data;
        } catch (error) {
            handleApiError(error);
        }
    }

    /**
     * Sends forgotten password email
     * @param email
     */
    async sendForgotPasswordEmail(email: string) {
        try {
            return (await this.userApi.forgottenPassword({forgottenPasswordRequest: {email}})).data
        } catch (error) {
            handleApiError(error)
        }
    }

    /**
     * Set new password for the user
     * @param id
     * @param password
     */
    async newPassword(id: string, password: string) {
        try {
            return (await this.userApi.newPassword({newPasswordRequest: {id, password}})).data
        } catch (error) {
            handleApiError(error)
        }
    }

    /**
     * Verify email
     * @param id
     */
    async verifyEmail(id: string) {
        try {
            return (await this.userApi.verify({verificationRequest: {id}})).data
        } catch (error) {
            handleApiError(error)
        }
    }

}

export const userService = new UserService();
