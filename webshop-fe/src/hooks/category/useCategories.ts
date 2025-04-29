import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/CategoryService';
import { CategoryResponse } from '@/shared/api';

export const useCategories = () => {
    return useQuery<CategoryResponse[], Error>({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAll(),
    });
};