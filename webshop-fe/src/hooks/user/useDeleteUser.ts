import { useMutation } from "@tanstack/react-query";
import { userService } from "../../services/UserService";
import { ApiError } from "../../shared/ApiError";
import { useUserGuard } from "../useUserGuard";
import { useAuth } from "../UseAuth";

export const useDeleteUser = () => {
    const { assertUser } = useUserGuard();
    const { logout } = useAuth();

    return useMutation<void, ApiError>({
        mutationFn: async () => {
            assertUser();
            await userService.deleteUser();
        },
        onSuccess: () => {
            logout();
        },
        onError: (error) => {
            console.error("Error deleting user:", error);
        },
    });
};
