import {useQuery} from "@tanstack/react-query";
import {productService} from "../../services/ProductService";
import {GetAllGendersEnum, ProductResponse} from "../../shared/api";

export const useProductsByCategory = (category: string, gender?: string) => {
    return useQuery<ProductResponse[]>({
        queryKey: ["products-by-category", category, gender],
        queryFn: async () => {
            const requestParams = {
                categories: [category],
                genders: gender ? [gender as GetAllGendersEnum] : [],
                page: 0,
                size: 4,
                showOutOfStock: false,
                sortType: "DESC_DISCOUNT" as const,
            };
            const response = await productService.getAll(requestParams);
            return response.content ?? [];
        },
        enabled: !!category,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
