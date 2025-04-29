import {createContext} from 'react';

interface AuthContextType {
    role: string | null;
    loggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


