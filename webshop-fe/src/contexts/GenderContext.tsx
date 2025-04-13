import React, {createContext, ReactNode, useEffect, useState} from "react";
import {Gender} from "../types/gender";

interface GenderContextType {
    gender: Gender;
    setGender: (gender: Gender) => void;
}

export const GenderContext = createContext<GenderContextType | undefined>(undefined);

interface GenderProviderProps {
    children: ReactNode;
}

export const GenderProvider: React.FC<GenderProviderProps> = ({children}) => {
    const [gender, setGender] = useState<Gender>(() => {
        return (localStorage.getItem("gender") as Gender) || "men";
    });

    useEffect(() => {
        localStorage.setItem("gender", gender);
    }, [gender]);

    return (
        <GenderContext.Provider value={{gender, setGender}}>
            {children}
        </GenderContext.Provider>
    );
};