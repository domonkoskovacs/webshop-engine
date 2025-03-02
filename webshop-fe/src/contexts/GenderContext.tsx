import React, { createContext, useState, ReactNode } from "react";

export type Gender = 'men' | 'women';

interface GenderContextType {
    gender: Gender;
    setGender: (gender: Gender) => void;
}

export const GenderContext = createContext<GenderContextType | undefined>(undefined);

interface GenderProviderProps {
    children: ReactNode;
}

export const GenderProvider: React.FC<GenderProviderProps> = ({ children }) => {
    const [gender, setGender] = useState<Gender>("men");

    return (
        <GenderContext.Provider value={{ gender, setGender }}>
            {children}
        </GenderContext.Provider>
    );
};