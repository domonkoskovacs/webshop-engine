import { useQuery } from "@tanstack/react-query";
import { CartItemResponse } from "../../shared/api";
import { userService } from "../../services/UserService";
import { useUserGuard } from "../useUserGuard";

export const useCart = () => {
    const { assertUser } = useUserGuard();

    const { data: cart = [] } = useQuery<CartItemResponse[]>({
        queryKey: ["cart"],
        queryFn: async () => {
            assertUser();
            return await userService.getCart();
        },
    });

    const isInCart = (productId: string): boolean => {
        return cart.some(item => item.product?.id === productId);
    };

    return { cart, isInCart };
};
