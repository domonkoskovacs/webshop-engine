import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emailService } from 'src/services/EmailService';
import { ApiError } from 'src/shared/ApiError';
import { useAdminGuard } from '../useAdminGuard';

export const useDeleteEmail = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAdminGuard();

    return useMutation<void, ApiError, string>({
        mutationFn: async (id) => {
            assertAdmin();
            return emailService.delete(id);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['emails'] });
        },
    });
};
