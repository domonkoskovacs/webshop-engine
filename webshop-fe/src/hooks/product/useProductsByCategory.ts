import {useQuery} from "@tanstack/react-query";
import {productService} from "@/services/ProductService.ts";
import {GetAll1GendersEnum, ProductResponse} from "@/shared/api";
import {useGender} from "../useGender.ts";

const genderMap: Record<'men' | 'women', GetAll1GendersEnum> = {
    men: GetAll1GendersEnum.Men,
    women: GetAll1GendersEnum.Women
};

export const useProductsByCategory = (category: string) => {
    const {gender} = useGender();

    const genderFilters: GetAll1GendersEnum[] = [
        GetAll1GendersEnum.Unisex,
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
