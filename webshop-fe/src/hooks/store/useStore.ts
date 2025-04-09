import {useAdminGuard} from "../useAdminGuard";
import {useQuery} from "@tanstack/react-query";
import {StoreResponse} from "../../shared/api";
import {ApiError} from "../../shared/ApiError";
import {storeService} from "../../services/StoreService";

export const useStore = () => {
    const { assertAdmin } = useAdminGuard();

    return useQuery<StoreResponse, ApiError, StoreResponse, [string]>({
        queryKey: ["store"],
        queryFn: async () => {
            assertAdmin();
            return await storeService.get();
        },
        placeholderData: prev => prev,
    });
};