import React, {createContext, useCallback, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {toast} from "../hooks/useToast";
import {useCookies} from "react-cookie";
import {useLogin} from "../hooks/auth/useLogin";
import {useRefresh} from "../hooks/auth/useRefresh";
import {setupServiceInterceptors} from "../lib/interceptors.config";
import axiosInstance from "../lib/axios";

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

    const {mutateAsync: loginForToken} = useLogin();
    const {mutateAsync: refreshWithToken} = useRefresh();

    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        try {
            const response = await loginForToken({email, password});
            const {accessToken, role, refreshToken, refreshTokenTimeout} = response;
            if (accessToken && role && refreshToken && refreshTokenTimeout) {
                setAccessToken(accessToken);
                setRole(role);
                setLoggedIn(true);
                setCookie("loggedIn", "true", {path: "/"});
                setCookie("role", role, {path: "/"});
                setCookie("refreshToken", refreshToken, {maxAge: refreshTokenTimeout, path: "/"});
                if (role === "ROLE_ADMIN") {
                    navigate("/dashboard")
                } else {
                    navigate("/")
                }
                toast.info("You are successfully logged in.");
            } else {
                toast.error("Uh oh! Something went wrong.",
                    "Invalid response from the server while logging you in. Please try again.",);
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
            toast.info("Sad to see you go!");
        } catch (error) {
            toast.error("Uh oh! Something went wrong.",
                "Something went wrong while logging out. Please try again.",);
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
        toast.error("Uh oh! Something went wrong.", message);
    }, [logout]);

    useEffect(() => {
        const eject = setupServiceInterceptors(
            axiosInstance,
            () => accessToken,
            () => cookies.refreshToken,
            (token) => setAccessToken(token),
            async (refreshToken) => {
                const response = await refreshWithToken(refreshToken);
                return response?.accessToken ?? null;
            },
            handleAuthError
        );

        return () => eject();
    }, [accessToken, cookies.refreshToken, refreshWithToken, handleAuthError]);

    return (
        <AuthContext.Provider value={{role, loggedIn, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};
