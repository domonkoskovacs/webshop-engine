import {useMutation} from '@tanstack/react-query';
import {emailService} from '@/services/EmailService';
import {ApiError} from '@/shared/ApiError';
import {useAuthGuard} from "@/hooks/useAuthGuard.ts";

interface TestEmailPayload {
    id: string;
    email: string;
}

export const useTestEmail = () => {
    const {assertAdmin} = useAuthGuard();

    return useMutation<void, ApiError, TestEmailPayload>({
        mutationFn: async ({id, email}) => {
            assertAdmin();
            return emailService.test(id, email);
        },
    });
};
