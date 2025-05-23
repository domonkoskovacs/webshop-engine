import React from "react";
import {CartItemResponse, ResultEntryReasonCodeEnum} from "@/shared/api";
import {Badge} from "../../ui/badge.tsx";
import {Minus, Plus} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {ApiError} from "@/shared/ApiError.ts";
import {toast} from "@/hooks/useToast.ts";
import {useUpdateCart} from "@/hooks/user/useUpdateCart.ts";

interface CartHoverItemProps {
    item: CartItemResponse;
    type?: "hover" | "page";
    amountModifiable?: boolean
}

const CartItem: React.FC<CartHoverItemProps> = ({item, type = "hover", amountModifiable = true}) => {
    const {mutateAsync: updateCart, isPending} = useUpdateCart();

    const handleUpdate = async (newCount: number) => {
        try {
            await updateCart({count: newCount, productId: item.product?.id ?? ''});
        } catch (error) {
            if (error instanceof ApiError && error.error) {
                const errorMap = new Map(
                    error.error.map(err => [err.reasonCode, true])
                );

                if (errorMap.get(ResultEntryReasonCodeEnum.NotEnoughProductInStock)) {
                    toast.warn("Not enough products in stock.");
                }
            } else {
                toast.error("Error updating cart.");
            }
        }
    };

    const originalPrice = item.product?.price ?? NaN;
    const discount = item.product?.discountPercentage ?? 0;
    const discountedPrice = originalPrice * (1 - discount / 100);
    const isDiscounted = discount > 0;
    const imageSize = type === "page" ? "w-20 h-20" : "w-14 h-14";

    return <div className="flex items-center justify-between gap-3 border-b p-2 px-3">
        <div className="flex flex-col sm:flex-row h-full items-start sm:items-center gap-2 sm:gap-0">
            <img
                src={item.product?.imageUrls![0]}
                alt={item.product?.name}
                className={`${imageSize} object-cover rounded-md`}
            />
            <div className="flex flex-row">
                <h2 className="ml-0 sm:ml-4 mr-1 text-lg font-bold">{item.product?.name}</h2>
                {isDiscounted && (
                    <Badge className="h-4 bg-red-500 mt-1">
                        -{discount}%
                    </Badge>
                )}
            </div>
        </div>
        <div className="flex flex-col items-end text-right">
            <span className="text-sm text-gray-500">
                    {item.count} ×{" "}
                {isDiscounted ? (
                    <>
                        <span className="line-through">${originalPrice.toFixed(2)}</span>{" "}
                        <span className="text-red-500">${discountedPrice.toFixed(2)}</span>
                    </>
                ) : (
                    `$${originalPrice.toFixed(2)}`
                )}
                </span>
            <span className="font-semibold">
                    ${isDiscounted
                ? (item.count! * discountedPrice).toFixed(2)
                : (item.count! * originalPrice).toFixed(2)}
                </span>

            <div className="flex items-center mt-1 gap-2">
                {amountModifiable && <Button
                    variant="outline"
                    size="icon"
                    className="w-6 h-6 p-0"
                    disabled={item.count! < 1 || isPending}
                    onClick={() => handleUpdate(item.count! - 1)}
                >
                    <Minus size={14}/>
                </Button>}
                <span className="font-semibold">{item.count}</span>
                {amountModifiable && <Button
                    variant="outline"
                    size="icon"
                    disabled={isPending}
                    className="w-6 h-6 p-0"
                    onClick={() => handleUpdate(item.count! + 1)}
                >
                    <Plus size={14}/>
                </Button>}
            </div>
        </div>
    </div>
}

export default CartItem;