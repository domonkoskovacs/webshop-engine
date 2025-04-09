import { useMutation } from '@tanstack/react-query';
import { emailService } from 'src/services/EmailService';
import { ApiError } from 'src/shared/ApiError';
import { useAdminGuard } from '../useAdminGuard';

interface TestEmailPayload {
    id: string;
    email: string;
}

export const useTestEmail = () => {
    const { assertAdmin } = useAdminGuard();

    return useMutation<void, ApiError, TestEmailPayload>({
        mutationFn: async ({ id, email }) => {
            assertAdmin();
            return emailService.test(id, email);
        },
    });
};
