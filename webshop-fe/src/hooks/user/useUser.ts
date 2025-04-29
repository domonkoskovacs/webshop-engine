import {useQuery} from "@tanstack/react-query";
import {userService} from "@/services/UserService.ts";
import {UserResponse} from "@/shared/api";
import {ApiError} from "@/shared/ApiError.ts";
import {useAuthGuard} from "../useAuthGuard";

export const useUser = () => {
    const {isUser} = useAuthGuard()

    return useQuery<UserResponse, ApiError>({
        queryKey: ["user"],
        queryFn: async () => userService.getCurrent(),
        enabled: isUser
    });
};
