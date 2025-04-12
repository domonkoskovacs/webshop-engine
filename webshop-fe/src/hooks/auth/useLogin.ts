import {useMutation} from '@tanstack/react-query';
import {authService} from "../../services/AuthService";

export const useLogin = () => {
    return useMutation({
        mutationFn: ({email, password}: { email: string; password: string }) =>
            authService.login(email, password),
    });
};
