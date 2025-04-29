import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/UserService.ts";
import { ApiError } from "@/shared/ApiError.ts";
import { useAuthGuard } from "../useAuthGuard";
import {useUser} from "./useUser";

export const useChangePassword = () => {
    const { data: user } = useUser();
    const { assertUser } = useAuthGuard();

    return useMutation<void, ApiError, string>({
        mutationFn: async (newPassword: string) => {
            assertUser();
            const userId = user?.id;
            if (!userId) throw new Error("User ID not found");
            await userService.newPassword(userId, newPassword);
        },
    });
};
