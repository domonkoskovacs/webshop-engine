import {useMutation} from '@tanstack/react-query';
import {authService} from "@/services/AuthService.ts";

export const useRefresh = () => {
    return useMutation({
        mutationFn: (token: string) => authService.refresh(token),
    });
};
