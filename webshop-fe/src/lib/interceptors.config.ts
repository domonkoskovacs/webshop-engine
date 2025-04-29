import type {AxiosInstance} from 'axios';
import {ResultEntryReasonCodeEnum} from "@/shared/api";
import {handleApiError} from "../shared/ApiError";

export function setupServiceInterceptors(
    axios: AxiosInstance,
    getAccessToken: () => string | null,
    getRefreshToken: () => string | null,
    setAccessToken: (token: string) => void,
    refreshAccessToken: (token: string) => Promise<string | null>,
    onAuthError: (message: string) => void
) {
    const reqInterceptor = axios.interceptors.request.use(
        (config) => {
            const token = getAccessToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    const resInterceptor = axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (!error.response) handleApiError(error);

            const originalRequest = error.config;
            const {status, data} = error.response;

            const isJwtExpired =
                status === 401 &&
                data?.error?.[0]?.reasonCode === ResultEntryReasonCodeEnum.JwtExpiredError;

            if ((isJwtExpired || status === 403) && !originalRequest._retry) {
                originalRequest._retry = true;

                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    onAuthError("No refresh token found");
                    handleApiError(error);
                }

                const newAccessToken = await refreshAccessToken(refreshToken);
                if (!newAccessToken) {
                    onAuthError("Unable to refresh token.");
                    handleApiError(error);
                }

                setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
            }
            handleApiError(error);
        }
    );

    return () => {
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
    };
}
