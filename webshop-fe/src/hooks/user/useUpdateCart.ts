import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/UserService";
import {
    CartItemRequest,
    CartItemResponse,
    ResultEntryReasonCodeEnum,
} from "../../shared/api";
import { ApiError } from "../../shared/ApiError";
import { useUserGuard } from "../useUserGuard";
import { useToast } from "../UseToast";
import { useCart } from "./useCart";

export const useUpdateCart = () => {
    const queryClient = useQueryClient();
    const { assertUser } = useUserGuard();
    const { toast } = useToast();
    const { data: cart = [] } = useCart();

    const mutation = useMutation<CartItemResponse[], ApiError, CartItemRequest>({
        mutationFn: async (cartItem) => {
            assertUser();
            return await userService.updateCart([cartItem]);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
    });

    const increaseOneInCart = async (productId: string) => {
        try {
            const existingItem = cart.find((item) => item.product?.id === productId);

            const updatedCartItem: CartItemRequest = {
                productId,
                count: existingItem ? existingItem.count! + 1 : 1,
            };

            await mutation.mutateAsync(updatedCartItem);
        } catch (error) {
            throw error;
        }
    };

    const addItemToCart = async (productId: string, loggedIn: boolean) => {
        if (!loggedIn) {
            toast({ description: "You need to log in to update your cart." });
            return;
        }

        try {
            await increaseOneInCart(productId);
            toast({ description: "Item added to cart." });
        } catch (error) {
            if (error instanceof ApiError && error.error) {
                const errorMap = new Map(error.error.map((err) => [err.reasonCode, true]));
                if (errorMap.get(ResultEntryReasonCodeEnum.NotEnoughProductInStock)) {
                    toast({ description: "Not enough products in stock." });
                    return;
                }
            }

            toast({
                variant: "destructive",
                description: "Error updating cart.",
            });
        }
    };

    return {
        ...mutation,
        increaseOneInCart,
        addItemToCart,
    };
};
