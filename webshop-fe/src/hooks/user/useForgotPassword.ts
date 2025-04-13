import {useMutation} from "@tanstack/react-query";
import {userService} from "../../services/UserService";
import {ApiError} from "../../shared/ApiError";

export const useForgotPassword = () => {
    return useMutation<void, ApiError, string>({
        mutationFn: async (email: string) => {
            await userService.sendForgotPasswordEmail(email);
        }
    });
};
