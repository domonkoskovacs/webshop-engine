import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {PublicStoreResponse} from "../shared/api";
import {storeService} from "../services/StoreService";

interface PublicStoreContextType {
    store: PublicStoreResponse | undefined;
}

export const PublicStoreContext = createContext<PublicStoreContextType | undefined>(undefined);

interface PublicStoreProviderProps {
    children: ReactNode;
}

export const PublicStoreProvider: React.FC<PublicStoreProviderProps> = ({children}) => {
    const [store, setStore] = useState<PublicStoreResponse | undefined>();

    const fetchStore = useCallback(async () => {
        try {
            const data = await storeService.getPublic();
            if (data) {
                setStore(data);
            }
        } catch (error) {
            console.error("Error fetching store:", error);
        }
    }, []);

    useEffect(() => {
        (async () => {
            await fetchStore();
        })();
    }, [fetchStore]);

    return (
        <PublicStoreContext.Provider value={{store}}>
            {children}
        </PublicStoreContext.Provider>
    );
};