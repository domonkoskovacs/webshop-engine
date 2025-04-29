import {useMutation} from "@tanstack/react-query";
import {userService} from "@/services/UserService.ts";
import {ApiError} from "@/shared/ApiError.ts";

export const useResendVerificationEmail = () => {
    return useMutation<void, ApiError, string>({
        mutationFn: async (email: string) => {
            await userService.resendVerifyEmail(email);
        },
    });
};
