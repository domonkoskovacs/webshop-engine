import React, {createContext, useState} from 'react';

interface AuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    role: string | null;
    setRole: (role: string | null) => void;
    loggedIn: boolean;
    setLoggedIn: (open: boolean) => void;
}

export const AuthContext =
    createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    return (
        <AuthContext.Provider value={{accessToken, setAccessToken, role, setRole, loggedIn, setLoggedIn}}>
            {children}
        </AuthContext.Provider>
    );
};
