import {useQuery} from "@tanstack/react-query";
import {userService} from "../../services/UserService";
import {UserResponse} from "../../shared/api";
import {ApiError} from "../../shared/ApiError";
import {useAuthGuard} from "../useAuthGuard";

export const useUser = () => {
    const {isUser} = useAuthGuard()

    return useQuery<UserResponse, ApiError>({
        queryKey: ["user"],
        queryFn: async () => userService.getCurrent(),
        enabled: isUser
    });
};
