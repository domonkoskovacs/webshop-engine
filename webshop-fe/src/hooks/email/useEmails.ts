import {useQuery} from '@tanstack/react-query';
import {emailService} from '@/services/EmailService';
import {PromotionEmailResponse} from '@/shared/api';
import {ApiError} from '@/shared/ApiError';
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

export const useEmails = () => {
    const {isAdmin} = useAuthGuard();

    return useQuery<PromotionEmailResponse[], ApiError>({
        queryKey: ['emails'],
        queryFn: async () => emailService.getAll(),
        enabled: isAdmin
    });
};
