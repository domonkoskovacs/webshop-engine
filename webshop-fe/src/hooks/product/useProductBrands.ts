import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/ProductService.ts";
import { BrandResponse } from "@/shared/api";

export const useProductBrands = () => {
    return useQuery<BrandResponse[]>({
        queryKey: ["brands"],
        queryFn: () => productService.getBrands(),
    });
};
