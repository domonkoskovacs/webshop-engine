import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/UserService.ts";
import { ApiError } from "@/shared/ApiError.ts";
import { useAuthGuard } from "../useAuthGuard";
import { useAuth } from "../useAuth.ts";

export const useDeleteUser = () => {
    const { assertUser } = useAuthGuard();
    const { logout } = useAuth();

    return useMutation<void, ApiError>({
        mutationFn: async () => {
            assertUser();
            await userService.deleteUser();
        },
        onSuccess: () => {
            logout();
        },
    });
};
