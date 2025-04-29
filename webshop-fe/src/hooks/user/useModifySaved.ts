import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userService} from "@/services/UserService.ts";
import {ApiError} from "@/shared/ApiError.ts";
import {useSaved} from "./useSaved";
import {useAuthGuard} from "../useAuthGuard";
import {toast} from "../useToast";
import {useAuth} from "../useAuth.ts";

export const useModifySaved = () => {
    const queryClient = useQueryClient();
    const {assertUser} = useAuthGuard();
    const {isSaved} = useSaved();
    const { loggedIn } = useAuth();

    const addMutation = useMutation<void, ApiError, string>({
        mutationFn: async (id) => {
            assertUser();
            await userService.addSaved([id]);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["saved"]});
        },
    });

    const removeMutation = useMutation<void, ApiError, string>({
        mutationFn: async (id) => {
            assertUser();
            await userService.removeSaved([id]);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["saved"]});
        },
    });

    const toggleSaved = async (id: string) => {
        if (!loggedIn) {
            toast.warn("You need to log in to update saved products.");
            return;
        }

        try {
            if (isSaved(id)) {
                await removeMutation.mutateAsync(id);
            } else {
                await addMutation.mutateAsync(id);
            }
        } catch {
            toast.error("Error updating saved products.");
        }
    };

    return {
        toggleSaved,
        isToggling: addMutation.isPending || removeMutation.isPending,
        error: addMutation.error || removeMutation.error,
    };
};
