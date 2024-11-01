import React from "react";
import {ScrollArea} from "../ui/ScrollArea";
import AccountCard from "./AccountCard.component";
import {Button} from "../ui/Button";
import {ChartLine, Mail, Newspaper, Shirt, ShoppingBag, Store, UserCog} from "lucide-react";
import { LogOut } from 'lucide-react';
import {Link} from "react-router-dom";

const menuItems = [
    { icon: Newspaper, label: "Articles", path: "/admin/dashboard/article" },
    { icon: ShoppingBag, label: "Categories", path: "/admin/dashboard/category" },
    { icon: Mail, label: "Promotions", path: "/admin/dashboard/promotion-email" },
    { icon: ShoppingBag, label: "Orders", path: "/admin/dashboard/orders" },
    { icon: Shirt, label: "Products", path: "/admin/dashboard/products" },
    { icon: ChartLine, label: "Statistics", path: "/admin/dashboard/statistics" },
    { icon: Store, label: "Store", path: "/admin/dashboard/store" },
];

const Sidebar: React.FC = () => {

    return (
        <div className="bg-background shadow-md h-screen flex flex-col mr-2">
            <AccountCard/>
            <ScrollArea className="flex-grow my-2">
                {menuItems.map((item, index) => (
                    <Link key={index} to={item.path} className="w-full">
                        <Button variant="ghost" size="sm"
                                className="flex w-full items-center justify-start p-2 text-sm">
                            <item.icon className="ml-4 mr-2 w-4 h-4"/>
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </ScrollArea>
            <div className="mt-2">
                <Link to="/admin/dashboard/settings" className="w-full">
                    <Button variant="ghost" className="flex w-full items-center justify-start pl-2 pr-2 text-sm">
                        <UserCog className="ml-4 mr-2 w-4 h-4"/>
                        Settings
                    </Button>
                </Link>
                <Link to="/" className="w-full">
                    <Button variant="ghost" className="flex w-full items-center justify-start pl-2 pr-2 text-sm">
                        <LogOut className="ml-4 mr-2 w-4 h-4"/>
                        Logout
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar;