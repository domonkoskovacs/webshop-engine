import { useQuery } from "@tanstack/react-query";
import { ProductResponse } from "../../shared/api";
import { userService } from "../../services/UserService";
import { ApiError } from "../../shared/ApiError";
import { useUserGuard } from "../useUserGuard";

export const useSaved = () => {
    const { assertUser } = useUserGuard();

    const { data: saved = [] } = useQuery<ProductResponse[], ApiError>({
        queryKey: ["saved"],
        queryFn: async () => {
            assertUser();
            return userService.getSaved();
        },
        staleTime: 60 * 1000,
    });

    const isSaved = (id: string): boolean => {
        return saved.some(item => item.id === id);
    };

    return { saved, isSaved };
};
