import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userService} from "@/services/UserService.ts";
import {ApiError} from "@/shared/ApiError.ts";

export const useVerifyEmail = () => {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: async (id: string) => {
            await userService.verifyEmail(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["user"]});
        },
    });
};
