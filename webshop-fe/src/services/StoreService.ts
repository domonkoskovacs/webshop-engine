import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";
import {StoreRequest, StoreServiceApi} from "../shared/api";

class StoreService {
    private storeApi: StoreServiceApi

    constructor() {
        this.storeApi = new StoreServiceApi(ApiConfig.getConfig());
    }

    /**
     * Get store configuration
     */
    async get() {
        return handleApiCall(() =>
            this.storeApi.getStore()
                .then(res => res?.data)
        );
    }

    /**
     * Get store configuration
     */
    async update(storeRequest: StoreRequest) {
        return handleApiCall(() =>
            this.storeApi.updateStore({storeRequest})
                .then(res => res?.data)
        );
    }

}

export const storeService = new StoreService();
