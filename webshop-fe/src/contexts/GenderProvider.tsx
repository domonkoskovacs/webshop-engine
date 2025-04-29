import React, {ReactNode, useEffect, useState} from "react";
import {Gender} from "@/types/gender";
import {GenderContext} from "@/contexts/GenderContext.ts";

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