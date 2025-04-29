import {useAuthGuard} from "../useAuthGuard";
import {useMutation} from "@tanstack/react-query";
import {orderService} from "@/services/OrderService.ts";
import {downloadCSV} from "@/lib/file.utils.ts";
import {CsvResponse} from "@/shared/api";

export const useExportOrders = () => {
    const {assertAdmin} = useAuthGuard();

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