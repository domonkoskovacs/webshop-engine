import {useQuery} from "@tanstack/react-query";
import {ProductResponse} from "@/shared/api";
import {userService} from "@/services/UserService.ts";
import {ApiError} from "@/shared/ApiError.ts";
import {useAuthGuard} from "../useAuthGuard";

export const useSaved = () => {
    const {isUser} = useAuthGuard();

    const {data: saved = []} = useQuery<ProductResponse[], ApiError>({
        queryKey: ["saved"],
        queryFn: async () => userService.getSaved(),
        enabled: isUser,
        staleTime: 60 * 1000,
    });

    const isSaved = (id: string): boolean => {
        return saved.some(item => item.id === id);
    };

    return {saved, isSaved};
};
