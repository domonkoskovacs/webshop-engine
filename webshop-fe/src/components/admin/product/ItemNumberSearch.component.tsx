import React from "react";
import {Input} from "src/components/ui/Input";
import {ProductServiceApiGetAllRequest} from "../../../shared/api";

interface ItemNumberSearchProps {
    inputRef: React.RefObject<HTMLInputElement>;
    setIsInputFocused: (val: boolean) => void;
    filters: ProductServiceApiGetAllRequest;
    updateFilters: (newFilters: Partial<ProductServiceApiGetAllRequest>) => void;
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

