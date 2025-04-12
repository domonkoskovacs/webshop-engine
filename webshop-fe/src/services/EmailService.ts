import {EmailServiceApi, PromotionEmailRequest} from "../shared/api";
import {ApiBaseService} from "../shared/ApiBaseService";
import axiosInstance from "../lib/axios";

class EmailService extends ApiBaseService<EmailServiceApi> {
    constructor() {
        super(EmailServiceApi, axiosInstance);
    }

    /**
     * Create promotion email
     */
    async create(promotionEmailRequest: PromotionEmailRequest) {
        return this.api.create2({promotionEmailRequest}).then(res => res?.data)
    }

    /**
     * Get all emails
     */
    async getAll() {
        return this.api.getAll1().then(res => res?.data)
    }

    /**
     * Delete email by id
     */
    async delete(id: string) {
        return this.api.delete2({id}).then(res => res?.data)
    }

    /**
     * Send test email
     */
    async test(id: string, email: string) {
        return this.api.test({id, emailRequest: {email}}).then(res => res?.data)
    }

}

export const emailService = new EmailService();
