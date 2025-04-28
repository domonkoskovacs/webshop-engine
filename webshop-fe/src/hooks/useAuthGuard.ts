import {useAuth} from "./UseAuth";

export const useAuthGuard = () => {
    const {role, loggedIn, loading} = useAuth();

    const isAuthenticated = loggedIn && !loading;

    const isUser = role === 'ROLE_USER' && isAuthenticated;
    const isAdmin = role === 'ROLE_ADMIN' && isAuthenticated;

    const assertAuthenticated = () => {
        if (!isAuthenticated) {
            throw new Error('You must be logged in to perform this action.');
        }
    };

    const assertUser = () => {
        if (!isUser && !isAdmin) {
            throw new Error('You must be a user to perform this action.');
        }
    };

    const assertAdmin = () => {
        if (!isAdmin) {
            throw new Error('You must be an admin to perform this action.');
        }
    };

    return {
        isAuthenticated,
        isUser,
        isAdmin,
        assertAuthenticated,
        assertUser,
        assertAdmin,
    };
};
