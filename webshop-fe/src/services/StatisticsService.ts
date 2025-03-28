import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";
import {StatisticsServiceApi, StatisticsServiceApiGetStatisticsRequest} from "../shared/api";

class StatisticsService {
    private statisticsApi: StatisticsServiceApi

    constructor() {
        this.statisticsApi = new StatisticsServiceApi(ApiConfig.getConfig());
    }

    /**
     * Get statistics
     */
    async get(request: StatisticsServiceApiGetStatisticsRequest) {
        return handleApiCall(() =>
            this.statisticsApi.getStatistics(request)
                .then(res => res?.data)
        );
    }

}

export const statisticsService = new StatisticsService();
