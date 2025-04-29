import React, {useCallback, useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {useLogin} from "@/hooks/auth/useLogin.ts";
import {useRefresh} from "@/hooks/auth/useRefresh.ts";
import {useNavigate} from "react-router-dom";
import {AppPaths} from "@/routing/AppPaths.ts";
import {toast, unexpectedErrorToast} from "@/hooks/useToast.ts";
import {setupServiceInterceptors} from "@/lib/interceptors.config.ts";
import axiosInstance from "@/lib/axios.ts";
import {AuthContext} from "@/contexts/AuthContext.ts";

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
                navigate(AppPaths.DASHBOARD_BASE)
            } else {
                navigate(AppPaths.HOME)
            }
            toast.info("You are successfully logged in.");
        } else {
            toast.error("Uh oh! Something went wrong.",
                "Invalid response from the server while logging you in. Please try again.",);
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
            navigate({
                pathname: AppPaths.AUTHENTICATION,
                search: '?type=login',
            });
            toast.info("Sad to see you go!");
        } catch (error) {
            unexpectedErrorToast(error, "Something went wrong while logging out. Please try again.")
        }
    }, [navigate, removeCookie])

    useEffect(() => {
        void (async () => {
            if (!accessToken && cookies.refreshToken) {
                try {
                    const response = await refreshWithToken(cookies.refreshToken);
                    const { accessToken: newAccessToken, role } = response;
                    if (newAccessToken && role) {
                        setAccessToken(newAccessToken);
                        setRole(role);
                        setLoggedIn(true);
                    } else {
                        logout();
                    }
                } catch (error) {
                    unexpectedErrorToast(error);
                    logout();
                }
            }
            setLoading(false);
        })();
    }, [accessToken, cookies.refreshToken, refreshWithToken, logout]);



    useEffect(() => {
        const storedLoggedIn = cookies.loggedIn;
        const storedRole = cookies.role;
        if (storedLoggedIn === true && storedRole) {
            setRole(storedRole);
            setLoggedIn(true);
        }
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