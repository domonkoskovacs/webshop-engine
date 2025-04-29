import {useMutation} from "@tanstack/react-query";
import {productService} from "@/services/ProductService.ts";
import {useAuthGuard} from "../useAuthGuard";
import {CsvResponse, ProductServiceApiExportRequest} from "@/shared/api";
import {ApiError} from "@/shared/ApiError.ts";

export const useExportProducts = () => {
    const {assertAdmin} = useAuthGuard();

    return useMutation<CsvResponse, ApiError, ProductServiceApiExportRequest>({
        mutationFn: async (exportRequest) => {
            assertAdmin();
            return productService.export(exportRequest);
        },
    });
};
