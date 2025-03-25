import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";
import {StatisticsServiceApi} from "../shared/api";

class StatisticsService {
    private statisticsApi: StatisticsServiceApi

    constructor() {
        this.statisticsApi = new StatisticsServiceApi(ApiConfig.getConfig());
    }

    /**
     * Get statistics
     */
    async get(from: string, to: string, topCount: number) {
        return handleApiCall(() =>
            this.statisticsApi.getStatistics({from, to, topCount})
                .then(res => res?.data)
        );
    }

}

export const statisticsService = new StatisticsService();
