import {useQuery} from "@tanstack/react-query";
import {StatisticsResponse, StatisticsServiceApiGetStatisticsRequest} from "@/shared/api";
import {statisticsService} from "@/services/StatisticsService.ts";
import {ApiError} from "@/shared/ApiError.ts";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useStatistics = (request: StatisticsServiceApiGetStatisticsRequest) => {
    const {isAdmin} = useAuthGuard();

    return useQuery<StatisticsResponse, ApiError, StatisticsResponse, [string, StatisticsServiceApiGetStatisticsRequest]>({
        queryKey: ['statistics', request],
        queryFn: async () => await statisticsService.get(request),
        enabled: isAdmin,
        placeholderData: (previousData) => previousData
    });
};
