import { useQuery } from '@tanstack/react-query';
import { categoryService } from 'src/services/CategoryService';
import { CategoryResponse } from 'src/shared/api';

export const useCategories = () => {
    return useQuery<CategoryResponse[], Error>({
        queryKey: ['categories'],
        queryFn: () => categoryService.getAll(),
    });
};