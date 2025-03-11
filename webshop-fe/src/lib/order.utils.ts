import {OrderResponse} from "../shared/api";

export function formatDate(date: string | undefined) {
    if (!date) return "-";
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
}

export function isCancelable(order: OrderResponse) {
    return true
}

export function isReturnable(order: OrderResponse) {
    return true
}