"use client"

import * as React from "react"
import {useEffect, useState} from "react"

import {cn} from "src/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "src/components/ui/NavigationMenu"
import {apiService} from "../../../shared/ApiService";
import {CategoryResponse} from "../../../shared/api";
import {Link} from "react-router-dom";

const MenuBar: React.FC = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const categoryList = await apiService.getAllCategory();
                setCategories(categoryList);
            } catch (err) {
                setError("Failed to load categories.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <NavigationMenu className="w-full">
            <NavigationMenuList className="flex flex-wrap justify-start">
                {loading && <NavigationMenuItem>Loading...</NavigationMenuItem>}

                {error && <NavigationMenuItem>{error}</NavigationMenuItem>}

                {!loading &&
                    !error &&
                    categories.map((category) => (
                        category.subCategories && category.subCategories.length > 0 ?
                            <NavigationMenuItem key={category.id}>
                                <NavigationMenuTrigger className="flex-shrink-0">{category.name}</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                        {category.subCategories?.map((subCategory) => (
                                            <ListItem
                                                key={subCategory.id}
                                                title={subCategory.name}
                                                href={`/products?category=${encodeURIComponent(category.name ?? "")}&subcategory=${encodeURIComponent(subCategory.name ?? "")}`}
                                            />
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem> :
                            <NavigationMenuItem className="flex-shrink-0">
                                <Link to={`/products?category=${encodeURIComponent(category.name ?? "")}`}>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        {category.name}
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>

                    ))}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"

export default MenuBar