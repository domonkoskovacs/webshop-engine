import {toast as sonner} from "sonner";

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

export const unexpectedErrorToast = () =>
    toast.error("Uh oh! Something went wrong.", "Unexpected error occurred");
