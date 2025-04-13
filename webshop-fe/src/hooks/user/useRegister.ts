import {useMutation} from "@tanstack/react-query";
import {userService} from "../../services/UserService";
import {ApiError} from "../../shared/ApiError";
import {UserServiceApiRegisterRequest} from "../../shared/api";

export const useRegister = () => {
    return useMutation<void, ApiError, UserServiceApiRegisterRequest>({
        mutationFn: async (request) => {
            await userService.register(request);
        },
    });
};