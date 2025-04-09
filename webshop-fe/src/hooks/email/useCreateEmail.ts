import { useMutation, useQueryClient } from '@tanstack/react-query';
import { emailService } from 'src/services/EmailService';
import { PromotionEmailRequest, PromotionEmailResponse } from 'src/shared/api';
import { ApiError } from 'src/shared/ApiError';
import { useAdminGuard } from '../useAdminGuard';

export const useCreateEmail = () => {
    const queryClient = useQueryClient();
    const { assertAdmin } = useAdminGuard();

    return useMutation<PromotionEmailResponse, ApiError, PromotionEmailRequest>({
        mutationFn: async (request) => {
            assertAdmin();
            return emailService.create(request);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['emails'] });
        },
    });
};
