import {useQuery} from "@tanstack/react-query";
import {StatisticsResponse, StatisticsServiceApiGetStatisticsRequest} from "../../shared/api";
import {useAdminGuard} from "../useAdminGuard";
import {statisticsService} from "../../services/StatisticsService";
import {ApiError} from "../../shared/ApiError";

export const useStatistics = (request: StatisticsServiceApiGetStatisticsRequest) => {
    const { assertAdmin } = useAdminGuard();

    return useQuery<StatisticsResponse, ApiError, StatisticsResponse, [string, StatisticsServiceApiGetStatisticsRequest]>({
        queryKey: ['statistics', request],
        queryFn: async () => {
            assertAdmin();
            return await statisticsService.get(request);
        },
        placeholderData: (previousData) => previousData
    });
};
