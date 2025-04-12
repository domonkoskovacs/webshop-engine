import { useQuery } from "@tanstack/react-query";
import { productService } from "../../services/ProductService";
import { BrandResponse } from "../../shared/api";

export const useProductBrands = () => {
    return useQuery<BrandResponse[]>({
        queryKey: ["brands"],
        queryFn: () => productService.getBrands(),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};
