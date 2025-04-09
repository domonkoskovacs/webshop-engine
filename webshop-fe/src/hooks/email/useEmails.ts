import {useQuery} from '@tanstack/react-query';
import {emailService} from 'src/services/EmailService';
import {PromotionEmailResponse} from 'src/shared/api';
import {ApiError} from 'src/shared/ApiError';
import {useAdminGuard} from "../useAdminGuard";

export const useEmails = () => {
    const {assertAdmin} = useAdminGuard();

    return useQuery<PromotionEmailResponse[], ApiError>({
        queryKey: ['emails'],
        queryFn: async () => {
            assertAdmin();
            return emailService.getAll();
        },
    });
};
