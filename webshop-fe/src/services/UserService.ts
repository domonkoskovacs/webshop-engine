import {
    CartItemRequest,
    RegistrationRequestGenderEnum,
    UpdateUserRequest,
    UserServiceApi
} from "../shared/api";
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


    /**
     * Get current user
     */
    async getCurrent() {
        return handleApiCall(() =>
            this.userApi.getCurrentUser()
                .then(res => res?.data)
        );
    }

    /**
     * Update user
     * @param updateUserRequest rq
     */
    async updateUser(updateUserRequest: UpdateUserRequest) {
        return handleApiCall(() =>
            this.userApi.updateUser({updateUserRequest})
                .then(res => res?.data)
        );
    }

    /**
     * Delete current user
     */
    async deleteUser() {
        return handleApiCall(() =>
            this.userApi.deleteUser()
                .then(res => res?.data)
        );
    }

    /**
     * Get saved products
     */
    async getSaved() {
        return handleApiCall(() =>
            this.userApi.getSaved()
                .then(res => res?.data)
        );
    }

    /**
     * Get cart products
     */
    async getCart() {
        return handleApiCall(() =>
            this.userApi.getCart()
                .then(res => res?.data)
        );
    }

    /**
     * Get orders
     */
    async getOrders() {
        return handleApiCall(() =>
            this.userApi.getOrders()
                .then(res => res?.data)
        );
    }

    /**
     * add saved products
     * @param productIds
     */
    async addSaved(productIds: string[] ) {
        return handleApiCall(() =>
            this.userApi.addSaved({requestBody: productIds})
                .then(res => res?.data)
        );
    }

    /**
     * remove saved products
     * @param productIds
     */
    async removeSaved(productIds: string[] ) {
        return handleApiCall(() =>
            this.userApi.removeSaved({requestBody: productIds})
                .then(res => res?.data)
        );
    }

    /**
     * update cart
     * @param cartItemRequests
     */
    async updateCart(cartItemRequests: CartItemRequest[] ) {
        return handleApiCall(() =>
            this.userApi.updateCart({cartItemRequest: cartItemRequests})
                .then(res => res?.data)
        );
    }

    /**
     * current users subscribes to email list
     */
    async subscribeToEmailList() {
        return handleApiCall(() =>
            this.userApi.subscribeToEmailList()
                .then(res => res?.data)
        );
    }

    /**
     * current users unsubscribes to email list
     */
    async unSubscribeToEmailList() {
        return handleApiCall(() =>
            this.userApi.unSubscribeToEmailList()
                .then(res => res?.data)
        );
    }
}

export const userService = new UserService();
