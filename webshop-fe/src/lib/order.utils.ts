import {OrderResponse, OrderResponseStatusEnum} from "../shared/api";

/**
 * Formats a date string for display.
 */
export function formatDate(date: string | undefined): string {
    if (!date) return "-";
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
}

/**
 * Returns true if the order can be paid.
 */
export function isPayable(order: OrderResponse): boolean {
    return order.status === OrderResponseStatusEnum.Created || order.status === OrderResponseStatusEnum.PaymentFailed;
}

/**
 * Returns true if the order can be cancelled.
 */
export function isCancelable(order: OrderResponse): boolean {
    return order.status === OrderResponseStatusEnum.Created ||
        order.status === OrderResponseStatusEnum.PaymentFailed ||
        order.status === OrderResponseStatusEnum.Paid ||
        order.status === OrderResponseStatusEnum.Processing ||
        order.status === OrderResponseStatusEnum.Packaged;
}

/**
 * Returns true if the order can be returned.
 */
export function isReturnable(order: OrderResponse): boolean {
    return order.status === OrderResponseStatusEnum.Delivered;
}

/**
 * Returns an object describing the available actions for the order.
 */
export function getOrderActions(order: OrderResponse) {
    return {
        canPay: isPayable(order),
        canCancel: isCancelable(order),
        canReturn: isReturnable(order),
    };
}
