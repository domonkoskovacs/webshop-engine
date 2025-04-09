import {useQuery} from "@tanstack/react-query";
import {PublicStoreResponse} from "../../shared/api";
import {storeService} from "../../services/StoreService";

export const usePublicStore = () => {
    return useQuery<PublicStoreResponse, Error, PublicStoreResponse, [string]>({
        queryKey: ["publicStore"],
        queryFn: async () => {
            return await storeService.getPublic();
        },
    });
};
