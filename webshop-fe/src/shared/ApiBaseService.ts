import type {AxiosInstance} from "axios";
import {ApiConfig} from "./ApiConfig";
import {BaseAPI} from "./api/base";

export abstract class ApiBaseService<T extends BaseAPI> {
    protected api: T;

    protected constructor(ApiClass: new (config: any) => T) {
        this.api = new ApiClass(ApiConfig.getConfig());
    }

    public getAxiosInstance(): AxiosInstance {
        const axiosInstance = (this.api as any)?.axios;
        if (!axiosInstance) {
            throw new Error("Axios instance not initialized. Check service instantiation.");
        }
        return axiosInstance;
    }

}
