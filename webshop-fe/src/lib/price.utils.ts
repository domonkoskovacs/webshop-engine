import {CartItemResponse} from "@/shared/api";

export function calculateCartTotals(cart: CartItemResponse[], shippingCost: number) {
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
    const finalPrice = discountedPrice + shippingCost;

    return { fullPrice, discountedPrice, discountAmount, finalPrice };
}

/**
 * Calculates the discounted price based on the full price and discount percentage.
 *
 * @param fullPrice - The original full price of the product.
 * @param discountPercentage - The discount percentage to apply.
 * @returns The price after applying the discount.
 */
export function calculateDiscountedPrice(fullPrice: number, discountPercentage: number): number {
    return discountPercentage > 0 ? fullPrice * (1 - discountPercentage / 100) : fullPrice;
}


