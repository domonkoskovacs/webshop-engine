import {useMutation, useQueryClient} from '@tanstack/react-query';
import {emailService} from '@/services/EmailService';
import {ApiError} from '@/shared/ApiError';
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useDeleteEmail = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAuthGuard();

    return useMutation<void, ApiError, string>({
        mutationFn: async (id) => {
            assertAdmin();
            return emailService.delete(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['emails']});
        },
    });
};
