import React from "react";
import {Input} from "@/components/ui/input";
import {ProductServiceApiGetAll1Request} from "@/shared/api";

interface ItemNumberSearchProps {
    inputRef: React.RefObject<HTMLInputElement | null>;
    setIsInputFocused: (val: boolean) => void;
    filters: ProductServiceApiGetAll1Request;
    updateFilters: (newFilters: Partial<ProductServiceApiGetAll1Request>) => void;
}

const ItemNumberSearch: React.FC<ItemNumberSearchProps> = ({inputRef, setIsInputFocused, filters, updateFilters}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFilters({itemNumber: e.target.value});
    };

    return (
        <Input
            ref={inputRef}
            placeholder="Search for Item No..."
            value={filters.itemNumber}
            onChange={handleChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
        />
    );
};

export default ItemNumberSearch;

