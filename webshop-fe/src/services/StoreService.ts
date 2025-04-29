import {StoreRequest, StoreServiceApi} from "@/shared/api";
import {ApiBaseService} from "../shared/ApiBaseService";
import axiosInstance from "../lib/axios";

class StoreService extends ApiBaseService<StoreServiceApi> {
    constructor() {
        super(StoreServiceApi, axiosInstance);
    }

    /**
     * Get store configuration
     */
    async get() {
        return this.api.getStore().then(res => res?.data)
    }

    /**
     * Get store configuration
     */
    async update(storeRequest: StoreRequest) {
        return this.api.updateStore({storeRequest}).then(res => res?.data)
    }

    /**
     * Get public store configuration
     */
    async getPublic() {
        return this.api.getPublicStore().then(res => res?.data)
    }

}

export const storeService = new StoreService();
