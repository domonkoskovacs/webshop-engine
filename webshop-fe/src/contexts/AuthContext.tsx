import React, {createContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {toast} from "../hooks/UseToast";
import axios from "axios";
import {apiService} from "../shared/ApiService";
import {useCookies} from "react-cookie";

interface AuthContextType {
    role: string | null;
    loggedIn: boolean;
    login: (token: string, role: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext =
    createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [cookies, setCookie, removeCookie] = useCookies(["refreshToken"]);

    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            const response = await apiService.login({email, password});
            const {accessToken, role, refreshToken, refreshTokenTimeout} = response;
            if (accessToken && role && refreshToken && refreshTokenTimeout) {
                setAccessToken(accessToken);
                setRole(role);
                setLoggedIn(true);
                setCookie("refreshToken", refreshToken, {
                    maxAge: refreshTokenTimeout,
                    path: "/",
                });
                if (role === "ROLE_ADMIN") {
                    navigate("/admin/dashboard")
                } else {
                    navigate("/")
                }
                toast({
                    description: "You are successfully logged in.",
                })
            } else {
                throw new Error("Invalid response from the server");
            }
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        try {
            setAccessToken(null);
            setRole(null);
            setLoggedIn(false);
            removeCookie("refreshToken", {path: "/"});
            navigate("/");
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
    }

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
                const originalRequest = error.config;
                const errorData = error.response.data;
                const newAccessTokenNeeded = error.response?.status === 401 &&
                    errorData.error[0].reasonCode === "JWT_EXPIRED_ERROR"
                if ((newAccessTokenNeeded || error.response?.status === 403) && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = cookies.refreshToken;
                        if (refreshToken && typeof refreshToken === 'string') {
                            const response = await apiService.refresh({token: refreshToken});
                            const { accessToken } = response;
                            if(accessToken) {
                                setAccessToken(accessToken);
                                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                            } else {
                                throw new Error("Bad refresh token response");
                            }
                        } else {
                            throw new Error("Refresh token not available or is not a valid string");
                        }
                        return axios(originalRequest);
                    } catch (refreshError) {
                        logout();
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
    }, [accessToken, setAccessToken]);

    return (
        <AuthContext.Provider value={{role, loggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
