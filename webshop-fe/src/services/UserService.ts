import {CartItemRequest, UpdateUserRequest, UserServiceApi, UserServiceApiRegisterRequest} from "@/shared/api";
import {ApiBaseService} from "../shared/ApiBaseService";
import axiosInstance from "../lib/axios";

class UserService extends ApiBaseService<UserServiceApi> {
    constructor() {
        super(UserServiceApi, axiosInstance);
    }

    /**
     * Registers a new user
     */
    async register(request: UserServiceApiRegisterRequest) {
        return this.api.register(request).then(res => res?.data);
    }

    /**
     * Sends forgotten password email
     * @param email
     */
    async sendForgotPasswordEmail(email: string) {
        return this.api.forgottenPassword({forgottenPasswordRequest: {email}}).then(res => res?.data)
    }

    /**
     * Set new password for the user
     * @param id
     * @param password
     */
    async newPassword(id: string, password: string) {
        return this.api.newPassword({id, newPasswordRequest: {password}}).then(res => res?.data)
    }

    /**
     * Verify email
     * @param id
     */
    async verifyEmail(id: string) {
        return this.api.verify({id}).then(res => res?.data)
    }

    /**
     * Resend verify email
     * @param email
     */
    async resendVerifyEmail(email: string) {
        return this.api.resendVerify({emailRequest: {email}}).then(res => res?.data)
    }

    /**
     * Get current user
     */
    async getCurrent() {
        return this.api.getCurrentUser().then(res => res?.data)
    }

    /**
     * Update user
     * @param updateUserRequest rq
     */
    async updateUser(updateUserRequest: UpdateUserRequest) {
        return this.api.updateUser({updateUserRequest}).then(res => res?.data)
    }

    /**
     * Delete current user
     */
    async deleteUser() {
        return this.api.deleteUser().then(res => res?.data)
    }

    /**
     * Get saved products
     */
    async getSaved() {
        return this.api.getSaved().then(res => res?.data)
    }

    /**
     * Get cart products
     */
    async getCart() {
        return this.api.getCart().then(res => res?.data)
    }

    /**
     * add saved products
     * @param productIds
     */
    async addSaved(productIds: string[]) {
        return this.api.addSaved({requestBody: productIds}).then(res => res?.data)
    }

    /**
     * remove saved products
     * @param productIds
     */
    async removeSaved(productIds: string[]) {
        return this.api.removeSaved({requestBody: productIds}).then(res => res?.data)
    }

    /**
     * update cart
     * @param cartItemRequests
     */
    async updateCart(cartItemRequests: CartItemRequest[]) {
        return this.api.updateCart({cartItemRequest: cartItemRequests}).then(res => res?.data)
    }

    /**
     * update cart
     * @param id
     */
    async unsubscribeById(id: string) {
        return this.api.unSubscribeToEmailListWithId({id}).then(res => res?.data)
    }
}

export const userService = new UserService();
