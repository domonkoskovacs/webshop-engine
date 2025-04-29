import {useQuery} from "@tanstack/react-query";
import {StoreResponse} from "@/shared/api";
import {ApiError} from "@/shared/ApiError.ts";
import {storeService} from "@/services/StoreService.ts";
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useStore = () => {
    const {isAdmin} = useAuthGuard();

    return useQuery<StoreResponse, ApiError, StoreResponse, [string]>({
        queryKey: ["store"],
        queryFn: async () => await storeService.get(),
        enabled: isAdmin,
        placeholderData: prev => prev,
    });
};