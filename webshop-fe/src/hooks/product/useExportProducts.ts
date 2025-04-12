import {useMutation} from "@tanstack/react-query";
import {productService} from "../../services/ProductService";
import {useAdminGuard} from "../useAdminGuard";
import {CsvResponse, ProductServiceApiExportRequest} from "../../shared/api";
import {ApiError} from "../../shared/ApiError";

export const useExportProducts = () => {
    const {assertAdmin} = useAdminGuard();

    return useMutation<CsvResponse, ApiError, ProductServiceApiExportRequest>({
        mutationFn: async (exportRequest) => {
            assertAdmin();
            return productService.export(exportRequest);
        },
    });
};
