import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/UserService";
import { UserResponse } from "../../shared/api";
import { ApiError } from "../../shared/ApiError";
import { useUserGuard } from "../useUserGuard";

export const useUser = () => {
    const { assertUser } = useUserGuard();

    return useQuery<UserResponse, ApiError>({
        queryKey: ["user"],
        queryFn: async () => {
            assertUser();
            return userService.getCurrent();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    });
};
