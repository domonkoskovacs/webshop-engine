import {useAdminGuard} from "../useAdminGuard";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {StoreRequest, StoreResponse} from "../../shared/api";
import {storeService} from "../../services/StoreService";
import {ApiError} from "../../shared/ApiError";


export const useUpdateStore = () => {
    const {assertAdmin} = useAdminGuard();
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
