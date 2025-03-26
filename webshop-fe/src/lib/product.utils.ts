import {Gender} from "../contexts/GenderContext";

export const getProductGender = (itemGender: string, gender: Gender): string => {
    if (!itemGender) return "";
    return itemGender.toLowerCase() === "unisex"
        ? gender.toLowerCase()
        : itemGender.toLowerCase();
};