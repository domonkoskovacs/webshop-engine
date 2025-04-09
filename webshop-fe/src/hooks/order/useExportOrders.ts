import {useAdminGuard} from "../useAdminGuard";
import {useMutation} from "@tanstack/react-query";
import {orderService} from "../../services/OrderService";
import {downloadCSV} from "../../lib/file.utils";
import {CsvResponse} from "../../shared/api";

export const useExportOrders = () => {
    const {assertAdmin} = useAdminGuard();

    return useMutation<CsvResponse, Error, { from: string; to: string }>({
        mutationFn: async ({from, to}: { from: string; to: string }) => {
            assertAdmin();
            const response = await orderService.export(from, to);
            if (response.csv) {
                downloadCSV(response.csv, "orders.csv");
            }
            return response;
        },
    });
};