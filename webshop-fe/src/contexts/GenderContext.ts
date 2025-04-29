import {createContext} from "react";
import {Gender} from "@/types/gender";

interface GenderContextType {
    gender: Gender;
    setGender: (gender: Gender) => void;
}

export const GenderContext = createContext<GenderContextType | undefined>(undefined);