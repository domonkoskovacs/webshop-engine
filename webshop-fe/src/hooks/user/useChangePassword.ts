import { useMutation } from "@tanstack/react-query";
import { userService } from "../../services/UserService";
import { ApiError } from "../../shared/ApiError";
import { useUserGuard } from "../useUserGuard";
import {useUser} from "./useUser";

export const useChangePassword = () => {
    const { data: user } = useUser();
    const { assertUser } = useUserGuard();

    return useMutation<void, ApiError, string>({
        mutationFn: async (newPassword: string) => {
            assertUser();
            const userId = user?.id;
            if (!userId) throw new Error("User ID not found");
            await userService.newPassword(userId, newPassword);
        },
    });
};
