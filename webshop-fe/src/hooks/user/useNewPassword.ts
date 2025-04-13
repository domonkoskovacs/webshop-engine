import { useMutation } from "@tanstack/react-query";
import { userService } from "../../services/UserService";
import { ApiError } from "../../shared/ApiError";

export const useNewPassword = () => {
    return useMutation<void, ApiError, { id: string; password: string }>({
        mutationFn: async ({ id, password }) => {
            await userService.newPassword(id, password);
        },
    });
};
