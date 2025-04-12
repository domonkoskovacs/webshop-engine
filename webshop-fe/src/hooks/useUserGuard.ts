import { useAuth } from 'src/hooks/UseAuth';

export const useUserGuard = () => {
    const { role } = useAuth();

    const assertUser = () => {
        if (role !== 'ROLE_USER' && role !== 'ROLE_ADMIN') {
            throw new Error('You must be logged in to perform this action.');
        }
    };

    return { assertUser };
};
