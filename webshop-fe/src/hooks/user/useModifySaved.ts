import {useMutation, useQueryClient} from "@tanstack/react-query";
import {userService} from "../../services/UserService";
import {ApiError} from "../../shared/ApiError";
import {useSaved} from "./useSaved";
import {useUserGuard} from "../useUserGuard";
import {useToast} from "../UseToast";
import {useAuth} from "../UseAuth";

export const useModifySaved = () => {
    const queryClient = useQueryClient();
    const {assertUser} = useUserGuard();
    const {isSaved} = useSaved();
    const {toast} = useToast();
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
            toast({description: "You need to log in to update saved products."});
            return;
        }

        try {
            if (isSaved(id)) {
                await removeMutation.mutateAsync(id);
            } else {
                await addMutation.mutateAsync(id);
            }
        } catch {
            toast({
                variant: "destructive",
                description: "Error updating saved products.",
            });
        }
    };

    return {
        toggleSaved,
        isToggling: addMutation.isPending || removeMutation.isPending,
        error: addMutation.error || removeMutation.error,
    };
};
