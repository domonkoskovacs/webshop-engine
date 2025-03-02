import {useContext} from "react";
import {ProductInfiniteScrollContext} from "../contexts/ProductInfiniteScrollContext";

export const useProductScroll = () => {
    const context = useContext(ProductInfiniteScrollContext);
    if (!context) {
        throw new Error('useProductScroll must be used within an ProductInfiniteScrollProvider');
    }
    return context;
};
