import { OrderResponse } from "../shared/api";
import { OrderResponseStatusEnum } from "../shared/api";

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
 * (Only orders in the CREATED state are considered payable.)
 */
export function isPayable(order: OrderResponse): boolean {
    return order.status === OrderResponseStatusEnum.Created;
}

/**
 * Returns true if the order can be cancelled.
 * (Only orders in the CREATED state are considered cancellable.)
 */
export function isCancelable(order: OrderResponse): boolean {
    return order.status === OrderResponseStatusEnum.Created;
}

/**
 * Returns true if the order can be returned.
 * (For example, orders in the FINISHED state are considered returnable.)
 */
export function isReturnable(order: OrderResponse): boolean {
    return order.status === OrderResponseStatusEnum.Completed;
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
