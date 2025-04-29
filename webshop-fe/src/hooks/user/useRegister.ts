import {useMutation} from "@tanstack/react-query";
import {userService} from "@/services/UserService.ts";
import {ApiError} from "@/shared/ApiError.ts";
import {UserServiceApiRegisterRequest} from "@/shared/api";

export const useRegister = () => {
    return useMutation<void, ApiError, UserServiceApiRegisterRequest>({
        mutationFn: async (request) => {
            await userService.register(request);
        },
    });
};