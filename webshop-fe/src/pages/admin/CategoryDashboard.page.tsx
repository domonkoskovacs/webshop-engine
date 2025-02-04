import React, {useEffect, useState} from 'react';

import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,} from "src/components/ui/Table"
import {FolderPen, Trash2} from 'lucide-react';
import {Button} from "../../components/ui/Button";
import {CategoryResponse} from "../../shared/api";
import {categoryService} from "../../services/CategoryService";

const CategoryDashboard: React.FC = () => {

    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAll()
                setCategories(response);
            } catch (error) {

            }
        };

        fetchCategories();
    }, []);

    const deleteCategory = async (id: string) => {
        await categoryService.delete(id);
        setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== id)
        );
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <Table>
                <TableCaption>List of categories.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Category</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((category) => (
                        <TableRow key={category.id}>
                            <TableCell className="font-medium">{category.name}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost"><FolderPen/></Button>
                                <Button variant="ghost"><Trash2
                                    onClick={() => deleteCategory(category.id ?? '')}/></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CategoryDashboard;
