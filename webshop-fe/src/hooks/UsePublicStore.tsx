import {useContext} from "react";
import {PublicStoreContext} from "../contexts/PublicStoreContext";

export const usePublicStore = () => {
    const context = useContext(PublicStoreContext);
    if (!context) {
        throw new Error("usePublicStore must be used within a PublicStoreProvider");
    }
    return context;
};