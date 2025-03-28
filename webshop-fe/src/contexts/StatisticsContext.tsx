import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {StatisticsResponse, StatisticsServiceApiGetStatisticsRequest} from "../shared/api";
import {statisticsService} from "../services/StatisticsService";

interface StatisticsContextType {
    statistics: StatisticsResponse;
    statisticsRequest: StatisticsServiceApiGetStatisticsRequest;
    updateRequest: (from: string, to: string, topCount: number) => void
}

export const StatisticsContext = createContext<StatisticsContextType | undefined>(undefined);

interface StatisticsProviderProps {
    children: ReactNode;
}

export const StatisticsProvider: React.FC<StatisticsProviderProps> = ({children}) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];
    const [statistics, setStatistics] = useState<StatisticsResponse>({});
    const [statisticsRequest, setStatisticsRequest] = useState<StatisticsServiceApiGetStatisticsRequest>({
        from: startOfMonth,
        to: endOfMonth,
        topCount: 5,
    })

    const fetchStatistics = useCallback(async () => {
        try {
            const data = await statisticsService.get(statisticsRequest);
            if (data) {
                setStatistics(data);
            }
        } catch (error) {
            console.error("Error fetching statistics:", error);
        }
    }, [statisticsRequest]);

    useEffect(() => {
        (async () => {
            await fetchStatistics();
        })();
    }, [fetchStatistics]);

    const updateRequest = async (from: string, to: string, topCount: number) => {
        setStatisticsRequest({from, to, topCount})
    };

    return (
        <StatisticsContext.Provider value={{statistics, statisticsRequest, updateRequest}}>
            {children}
        </StatisticsContext.Provider>
    );
};