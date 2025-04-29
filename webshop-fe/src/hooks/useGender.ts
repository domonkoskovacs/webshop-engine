import {useContext} from "react";
import {GenderContext} from "../contexts/GenderContext.ts";

export const useGender = () => {
    const context = useContext(GenderContext);
    if (!context) {
        throw new Error("useGender must be used within a GenderProvider");
    }
    return context;
};