import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";
import {EmailServiceApi, PromotionEmailRequest} from "../shared/api";

class EmailService {
    private emailApi: EmailServiceApi

    constructor() {
        this.emailApi = new EmailServiceApi(ApiConfig.getConfig());
    }

    /**
     * Create promotion email
     */
    async create(promotionEmailRequest: PromotionEmailRequest) {
        return handleApiCall(() =>
            this.emailApi.create2({promotionEmailRequest})
                .then(res => res?.data)
        );
    }

    /**
     * Get all emails
     */
    async getAll() {
        return handleApiCall(() =>
            this.emailApi.getAll2()
                .then(res => res?.data)
        );
    }

    /**
     * Delete email by id
     */
    async delete(id: string) {
        return handleApiCall(() =>
            this.emailApi.delete1({id})
                .then(res => res?.data)
        );
    }

    /**
     * Send test email
     */
    async test(id: string, email: string) {
        return handleApiCall(() =>
            this.emailApi.test({id, emailRequest: {email}})
                .then(res => res?.data)
        );
    }

}

export const emailService = new EmailService();
