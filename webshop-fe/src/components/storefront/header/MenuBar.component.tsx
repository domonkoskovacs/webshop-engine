"use client"

import * as React from "react"

import {cn} from "@/lib/utils"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {Link} from "react-router-dom";
import {useGender} from "@/hooks/useGender.ts";
import {useCategories} from "@/hooks/category/useCategories.ts";

const MenuBar: React.FC = () => {
    const {data: categories = []} = useCategories();
    const {gender} = useGender()

    return (
        <NavigationMenu className="w-full">
            <NavigationMenuList className="flex flex-wrap justify-start">
                {categories.map((category) => (
                    category.subCategories && category.subCategories.length > 0 ?
                        <NavigationMenuItem key={category.id}>
                            <NavigationMenuTrigger className="flex-shrink-0">{category.name}</NavigationMenuTrigger>
                            <NavigationMenuContent className="w-full max-w-[calc(100vw-2rem)] overflow-hidden">
                                <ul className="grid w-[400px] gap-3 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                    {category.subCategories?.map((subCategory) => (
                                        <ListItem
                                            key={subCategory.id}
                                            title={subCategory.name}
                                            href={`/products/${gender}/${category.name}/${subCategory.name}`}
                                        />
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem> :
                        <NavigationMenuItem key={category.id} className="flex-shrink-0">
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link to={`/products/${gender}/${category.name}`}>
                                    {category.name}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ComponentRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({className, title, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none gap-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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