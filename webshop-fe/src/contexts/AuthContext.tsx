import React, {createContext, useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {toast} from "../hooks/UseToast";
import axios from "axios";
import {useCookies} from "react-cookie";
import {authService} from "../services/AuthService";
import {ResultEntryReasonCodeEnum} from "../shared/api";

interface AuthContextType {
    role: string | null;
    loggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [cookies, setCookie, removeCookie] = useCookies(["role", "loggedIn", "refreshToken"]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login(email, password);
            const {accessToken, role, refreshToken, refreshTokenTimeout} = response;
            if (accessToken && role && refreshToken && refreshTokenTimeout) {
                setAccessToken(accessToken);
                setRole(role);
                setLoggedIn(true);
                setCookie("loggedIn", "true", {path: "/"});
                setCookie("role", role, {path: "/"});
                setCookie("refreshToken", refreshToken, {maxAge: refreshTokenTimeout, path: "/"});
                if (role === "ROLE_ADMIN") {
                    navigate("/admin/dashboard")
                } else {
                    navigate("/")
                }
                toast({
                    description: "You are successfully logged in.",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "Invalid response from the server while logging you in. Please try again.",
                });
            }
        } catch (error) {
            throw error;
        }
    }

    const logout = useCallback(() => {
        try {
            setAccessToken(null);
            setRole(null);
            setLoggedIn(false);
            removeCookie("loggedIn", {path: "/"});
            removeCookie("role", {path: "/"});
            removeCookie("refreshToken", {path: "/"});
            navigate("/authentication?type=login");
            toast({
                description: "Sad to see you go!",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Something went wrong while logging out. Please try again.",
            });
        }
    }, [navigate, removeCookie])

    useEffect(() => {
        const storedLoggedIn = cookies.loggedIn;
        const storedRole = cookies.role;
        if (storedLoggedIn === true && storedRole) {
            setRole(storedRole);
            setLoggedIn(true);
        }
        setLoading(false);
    }, [cookies.loggedIn, cookies.role]);

    const handleAuthError = useCallback((message: string) => {
        logout();
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: message,
        });
    }, [logout]);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (!error.response) {
                    return Promise.reject(error);
                }

                const originalRequest = error.config;
                const { status, data } = error.response;
                const newAccessTokenNeeded = status === 401 &&
                    data.error[0].reasonCode === ResultEntryReasonCodeEnum.JwtExpiredError
                if ((newAccessTokenNeeded || status === 403) && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = cookies.refreshToken;
                        if (refreshToken && typeof refreshToken === 'string') {
                            const response = await authService.refresh(refreshToken);
                            const {accessToken} = response;
                            if (accessToken) {
                                setAccessToken(accessToken);
                                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                            } else {
                                handleAuthError("Can't renew your your authentication please login again.")
                                return Promise.reject(error);
                            }
                        } else {
                            handleAuthError("Can't renew your your authentication please login again.")
                            return Promise.reject(error);
                        }
                        return axios(originalRequest);
                    } catch (refreshError) {
                        handleAuthError("Can't renew your your authentication please login again.")
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor)
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken, setAccessToken, cookies.refreshToken, handleAuthError]);

    return (
        <AuthContext.Provider value={{role, loggedIn, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};
