import {useQuery} from "@tanstack/react-query";
import {ProductResponse} from "@/shared/api";
import {productService} from "@/services/ProductService.ts";

export const useProductById = (id: string) => {
    return useQuery<ProductResponse>({
        queryKey: ["product", id],
        queryFn: () => productService.getById(id),
        enabled: !!id
    });
};
