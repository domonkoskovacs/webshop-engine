import {useMutation, useQueryClient} from "@tanstack/react-query";
import { userService } from "../../services/UserService";
import { ApiError } from "../../shared/ApiError";

export const useUnsubscribeById = () => {
    const queryClient = useQueryClient();

    return useMutation<void, ApiError, string>({
        mutationFn: async (id: string) => {
            await userService.unsubscribeById(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["user"]});
        },
    });
};
