import {useAuthGuard} from "../useAuthGuard";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {StoreRequest, StoreResponse} from "@/shared/api";
import {storeService} from "@/services/StoreService.ts";
import {ApiError} from "@/shared/ApiError.ts";


export const useUpdateStore = () => {
    const {assertAdmin} = useAuthGuard();
    const queryClient = useQueryClient();

    return useMutation<StoreResponse, ApiError, StoreRequest>({
        mutationFn: async (storeRequest: StoreRequest) => {
            assertAdmin();
            return await storeService.update(storeRequest);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["store"]});
        },
    });
};
