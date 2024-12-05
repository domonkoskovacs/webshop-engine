import React, {createContext, useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {toast} from "../hooks/UseToast";
import axios from "axios";
import {apiService} from "../shared/ApiService";

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    role: string | null;
    setRole: (role: string | null) => void;
    loggedIn: boolean;
    setLoggedIn: (open: boolean) => void;
    logout: () => void;
}

export const AuthContext =
    createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const navigate = useNavigate();
    const logout = useCallback(() => {
        setAccessToken(null);
        setRole(null);
        setLoggedIn(false);
        toast({
            description: "Logged out, sad to see you go."
        })
        navigate("/");
    }, [navigate]);

    const refreshAccessToken =  useCallback(async () => {
        try {
            const data = await apiService.refresh();
            console.log(data)
            const {accessToken} = data
            setAccessToken(accessToken ?? null);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "failed to refresh token",
            })
            logout();
        }
    }, [logout]);

    const accessTokenRef = useRef(accessToken);

    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                if (accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                console.log(error)
                if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
                    originalRequest._retry = true;
                    console.log("hello")
                    await refreshAccessToken();
                    originalRequest.headers.Authorization = `Bearer ${accessTokenRef.current}`;
                    return axios(originalRequest);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken, refreshAccessToken]);

    return (
        <AuthContext.Provider value={{accessToken, setAccessToken, role, setRole, loggedIn, setLoggedIn, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
