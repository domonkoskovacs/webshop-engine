import { useAuth } from 'src/hooks/UseAuth';

export const useAdminGuard = () => {
    const { role } = useAuth();

    const assertAdmin = () => {
        if (role !== 'ROLE_ADMIN') {
            throw new Error('You are not authorized to perform this action.');
        }
    };

    return { assertAdmin };
};
