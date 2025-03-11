import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {StoreRequest, StoreResponse} from "../shared/api";
import {storeService} from "../services/StoreService";

interface StoreContextType {
    store: StoreResponse | undefined;
    updateStore: (storeRequest: StoreRequest) => Promise<void>;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
    children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({children}) => {
    const [store, setStore] = useState<StoreResponse | undefined>();

    const fetchStore = useCallback(async () => {
        try {
            const data = await storeService.get();
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

    const updateStore = async (storeRequest: StoreRequest) => {
        try {
            const updatedStore = await storeService.update(storeRequest);
            if (updatedStore) {
                setStore(updatedStore);
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <StoreContext.Provider value={{store, updateStore}}>
            {children}
        </StoreContext.Provider>
    );
};