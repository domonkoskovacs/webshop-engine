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
    async get(from: string, to: string, mostSavedProductCount: number, mostOrderedProductCount: number, topUserCount: number) {
        return handleApiCall(() =>
            this.statisticsApi.getStatistics({from, to, mostSavedProductCount, mostOrderedProductCount, topUserCount})
                .then(res => res?.data)
        );
    }

}

export const statisticsService = new StatisticsService();
