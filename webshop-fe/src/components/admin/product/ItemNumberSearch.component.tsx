import React, {useEffect} from "react";
import {Input} from "src/components/ui/Input";
import {useProduct} from "../../../hooks/UseProductPagination";

interface ItemNumberSearchProps {
    inputRef: React.RefObject<HTMLInputElement>;
    handleFocus: () => void
}

const ItemNumberSearch: React.FC<ItemNumberSearchProps> = ({inputRef, handleFocus}) => {
    const {filters, updateFilters} = useProduct()

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (filters.itemNumber !== filters.itemNumber) {
                updateFilters({itemNumber: filters.itemNumber});
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [filters.itemNumber, filters.itemNumber, updateFilters]);

    useEffect(() => {
        if (filters.itemNumber === undefined) {
            updateFilters({itemNumber: ""});
        }
    }, [filters.itemNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFilters({itemNumber: e.target.value});
    };

    return (
        <Input
            ref={inputRef}
            placeholder="Search for Item No..."
            className="max-w-sm mr-2"
            value={filters.itemNumber}
            onChange={handleChange}
            onFocus={handleFocus}
        />
    );
};

export default ItemNumberSearch;

