import {toast as sonner} from "sonner";
import {ApiError} from "@/shared/ApiError.ts";

export const toast = {
    success: (msg: string, description?: string) =>
        sonner.success(msg, {description}),

    error: (msg: string, description?: string) =>
        sonner.error(msg, {description}),

    warn: (msg: string, description?: string) =>
        sonner(msg, {
            description,
            icon: "⚠️",
            style: {
                backgroundColor: "#fef08a",
                color: "#78350f",
                border: "1px solid #fde047",
            },
        }),

    info: sonner,
};

export const unexpectedErrorToast = (
    error?: unknown,
    description?: string
) => {
    let reasonCode = "";

    if (error instanceof ApiError && error.error.length > 0) {
        reasonCode = error.error[0]?.reasonCode ?? "";
    }

    const message = `Uh oh! Something went wrong.${reasonCode ? ` (${reasonCode})` : ""}`;
    const fallbackDescription = "Unexpected error occurred";

    toast.error(message, description ?? fallbackDescription);
};



