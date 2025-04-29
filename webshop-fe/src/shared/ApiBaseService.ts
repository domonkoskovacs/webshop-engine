import type {AxiosInstance} from "axios";
import {ApiConfig} from "./ApiConfig";
import {BaseAPI} from "./api/base";
import {Configuration} from "@/shared/api";

export abstract class ApiBaseService<T extends BaseAPI> {
    protected api: T;

    protected constructor(
        ApiClass: new (config: Configuration, basePath?: string, axiosInstance?: AxiosInstance) => T,
        axiosInstance: AxiosInstance
    ) {
        this.api = new ApiClass(ApiConfig.getConfig(), undefined, axiosInstance);
    }
}
