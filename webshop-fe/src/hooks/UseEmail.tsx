import {useContext} from "react";
import {EmailContext} from "../contexts/EmailContext";

export const useEmail = () => {
    const context = useContext(EmailContext);
    if (!context) {
        throw new Error('useEmail must be used within an EmailProvider');
    }
    return context;
};
