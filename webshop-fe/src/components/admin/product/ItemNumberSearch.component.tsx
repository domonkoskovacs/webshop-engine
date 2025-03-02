import React from "react";
import {Input} from "src/components/ui/Input";
import {useProduct} from "../../../hooks/UseProduct";

interface ItemNumberSearchProps {
    inputRef: React.RefObject<HTMLInputElement>;
    setIsInputFocused: (val: boolean) => void
}

const ItemNumberSearch: React.FC<ItemNumberSearchProps> = ({inputRef, setIsInputFocused}) => {
    const {filters, updateFilters} = useProduct()

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

