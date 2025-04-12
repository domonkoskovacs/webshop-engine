import {useQuery} from "@tanstack/react-query";
import {productService} from "../../services/ProductService";
import {GetAllGendersEnum, ProductResponse} from "../../shared/api";
import {useGender} from "../useGender";

const genderMap: Record<'men' | 'women', GetAllGendersEnum> = {
    men: GetAllGendersEnum.Men,
    women: GetAllGendersEnum.Women
};

export const useProductsByCategory = (category: string) => {
    const {gender} = useGender();

    const genderFilters: GetAllGendersEnum[] = [
        GetAllGendersEnum.Unisex,
        genderMap[gender],
    ];

    return useQuery<ProductResponse[]>({
        queryKey: ["products-by-category", category, genderFilters],
        queryFn: async () => {
            const requestParams = {
                categories: [category],
                genders: genderFilters,
                page: 0,
                size: 4,
                showOutOfStock: false,
                sortType: "DESC_DISCOUNT" as const,
            };
            const response = await productService.getAll(requestParams);
            return response.content ?? [];
        },
        enabled: !!category,
        staleTime: 1000 * 60 * 5,
    });
};
