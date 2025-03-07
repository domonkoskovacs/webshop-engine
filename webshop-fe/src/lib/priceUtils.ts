import {CartItemResponse} from "../shared/api";

const SHIPPING_COST = 5;

export function calculateCartTotals(cart: CartItemResponse[]) {
    const fullPrice = cart.reduce(
        (total, item) => total + item.count! * item.product!.price!,
        0
    );

    const discountedPrice = cart.reduce((total, item) => {
        const price = item.product!.discountPercentage
            ? item.product!.price! * (1 - item.product!.discountPercentage / 100)
            : item.product!.price!;
        return total + item.count! * price;
    }, 0);

    const discountAmount = fullPrice - discountedPrice;
    const finalPrice = discountedPrice + SHIPPING_COST;

    return { fullPrice, discountedPrice, discountAmount, finalPrice };
}
