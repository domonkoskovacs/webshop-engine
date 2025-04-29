import {useMutation, useQueryClient} from '@tanstack/react-query';
import {emailService} from '@/services/EmailService';
import {PromotionEmailRequest, PromotionEmailResponse} from '@/shared/api';
import {ApiError} from '@/shared/ApiError';
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useCreateEmail = () => {
    const queryClient = useQueryClient();
    const {assertAdmin} = useAuthGuard();

    return useMutation<PromotionEmailResponse, ApiError, PromotionEmailRequest>({
        mutationFn: async (request) => {
            assertAdmin();
            return emailService.create(request);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['emails']});
        },
    });
};
