import React, {createContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {toast} from "../hooks/UseToast";

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
    const logout = () => {
        setAccessToken(null);
        setRole(null);
        setLoggedIn(false);
        toast({
            description: "Logged out, sad to see you go."
        })
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{accessToken, setAccessToken, role, setRole, loggedIn, setLoggedIn, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
