import {StatisticsServiceApi, StatisticsServiceApiGetStatisticsRequest} from "@/shared/api";
import {ApiBaseService} from "../shared/ApiBaseService";
import axiosInstance from "../lib/axios";

class StatisticsService extends ApiBaseService<StatisticsServiceApi> {
    constructor() {
        super(StatisticsServiceApi, axiosInstance);
    }

    /**
     * Get statistics
     */
    async get(request: StatisticsServiceApiGetStatisticsRequest) {
        return this.api.getStatistics(request).then(res => res?.data)
    }

}

export const statisticsService = new StatisticsService();
