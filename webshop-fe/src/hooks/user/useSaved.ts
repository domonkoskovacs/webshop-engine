import { useQuery } from "@tanstack/react-query";
import { ProductResponse } from "../../shared/api";
import { userService } from "../../services/UserService";
import { ApiError } from "../../shared/ApiError";
import { useUserGuard } from "../useUserGuard";

export const useSaved = () => {
    const { assertUser } = useUserGuard();

    return useQuery<ProductResponse[], ApiError>({
        queryKey: ["saved"],
        queryFn: async () => {
            assertUser();
            return userService.getSaved();
        },
        staleTime: 60 * 1000,
    });
};
