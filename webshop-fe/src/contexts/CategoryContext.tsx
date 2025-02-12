import React, {createContext, useEffect, useState} from "react";
import {categoryService} from "../services/CategoryService";
import {CategoryResponse} from "../shared/api";
import {toast} from "../hooks/UseToast";

interface CategoryContextType {
    categories: CategoryResponse[];
    create: (name: string) => Promise<void>;
    addSubCategory: (id: string, name: string) => Promise<void>;
    update: (id: string, name: string) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;
    deleteSubCategory: (id: string) => Promise<void>;
}

export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        (async () => {
            await fetchCategories();
        })();
    }, []);


    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't get categories. Please try again.",
            });
        }
    };

    const create = async (name: string) => {
        try {
            const newCategory = await categoryService.create(name);
            setCategories((prev) => [...prev, newCategory]);
        } catch (error) {
            throw error
        }
    };

    const addSubCategory = async (categoryId: string, name: string) => {
        try {
            const updatedCategory = await categoryService.addSubCategory(categoryId, name);
            setCategories((prev) =>
                prev.map((category) => (category.id === categoryId ? updatedCategory : category))
            );
        } catch (error) {
            throw error
        }
    };

    const update = async (categoryId: string, name: string) => {
        try {
            await categoryService.update(categoryId, name);
            setCategories((prev) =>
                prev.map((category) => (category.id === categoryId ? {...category, name} : category))
            );
        } catch (error) {
            throw error
        }
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            await categoryService.delete(categoryId);
            setCategories((prev) => prev.filter((category) => category.id !== categoryId));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't delete category. Please try again.",
            });
        }
    };

    const deleteSubCategory = async (subCategoryId: string) => {
        try {
            await categoryService.deleteSubCategory(subCategoryId);
            setCategories((prev) =>
                prev.map((category) => ({
                    ...category,
                    subCategories: category.subCategories?.filter((sub) => sub.id !== subCategoryId),
                }))
            );
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't delete subcategory. Please try again.",
            });
        }
    };

    return (
        <CategoryContext.Provider
            value={{categories, create, addSubCategory, update, deleteCategory, deleteSubCategory}}>
            {children}
        </CategoryContext.Provider>
    );
};