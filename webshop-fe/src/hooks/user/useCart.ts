import { useQuery } from "@tanstack/react-query";
import { CartItemResponse } from "../../shared/api";
import { userService } from "../../services/UserService";
import { useUserGuard } from "../useUserGuard";

export const useCart = () => {
    const { assertUser } = useUserGuard();

    return useQuery<CartItemResponse[]>({
        queryKey: ["cart"],
        queryFn: async () => {
            assertUser();
            return await userService.getCart();
        },
    });
};
