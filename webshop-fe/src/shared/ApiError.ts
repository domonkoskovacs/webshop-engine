import {ResultEntry, ResultEntryReasonCodeEnum} from "./api";
import axios from "axios";

/**
 * Represents an API error response with structured information.
 *
 * This class is used to handle and standardize error responses from the backend.
 * It contains details such as HTTP status, info messages, error details, and warnings.
 *
 * Usage:
 * - `throw new ApiError(status, message, info, error, warning);`
 * - `throw ApiError.createDefaultError();` (for unexpected errors)
 */
export class ApiError extends Error {
    status: number;
    info: ResultEntry[];
    error: ResultEntry[];
    warning: ResultEntry[];

    constructor(status: number, message: string, info: ResultEntry[] = [], error: ResultEntry[] = [], warning: ResultEntry[] = []) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.info = info;
        this.error = error;
        this.warning = warning;
    }

    /**
     * Creates a default unexpected error.
     * @returns {ApiError}
     */
    static createDefaultError(): ApiError {
        return new ApiError(
            500,
            "Unexpected error occurred",
            [],
            [
                {
                    ReasonStatus: 500,
                    reasonCode: ResultEntryReasonCodeEnum.InternalServerError,
                    message: "Unexpected error occurred",
                },
            ],
            []
        );
    }
}

/**
 * Handles API errors and throws an ApiError instance.
 * @param error The error object caught in a try-catch block.
 * @throws {ApiError}
 */
export function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        throw new ApiError(
            status,
            "API error occurred",
            data.info || [],
            data.error || [],
            data.warning || []
        );
    }

    // Fallback for unexpected errors
    throw ApiError.createDefaultError()
}