import {handleApiError} from "./ApiError";

/**
 * A utility function to handle API calls with automatic error handling.
 *
 * @template T The expected return type of the API call.
 * @param apiCall A function that returns a Promise resolving to the API response.
 * @returns A Promise resolving to the API response or `undefined` if an error occurs.
 */
export async function handleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    try {
        return await apiCall();
    } catch (error) {
        handleApiError(error);
    }
}
