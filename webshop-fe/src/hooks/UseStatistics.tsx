import {useContext} from "react";
import {StatisticsContext} from "../contexts/StatisticsContext";

export const useStatistics = () => {
    const context = useContext(StatisticsContext);
    if (!context) {
        throw new Error("useStatistics must be used within a StatisticsProvider");
    }
    return context;
};