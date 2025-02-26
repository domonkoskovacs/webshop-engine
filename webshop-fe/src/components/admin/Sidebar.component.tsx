import {ChartLine, LogOut, Mail, Newspaper, Shirt, ShoppingBag, Store, UserCog} from "lucide-react"
import {Link} from "react-router-dom";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "src/components/ui/Sidebar"
import {useAuth} from "../../hooks/UseAuth";
import {Avatar, AvatarFallback} from "../ui/Avatar";
import React from "react";
import {ScrollArea} from "../ui/ScrollArea";

// Menu items.
const storefront = [
    {icon: Newspaper, label: "Articles", path: "/admin/dashboard/article"},
    {icon: ShoppingBag, label: "Categories", path: "/admin/dashboard/category"},
    {icon: Shirt, label: "Products", path: "/admin/dashboard/products"},
    {icon: Store, label: "Store", path: "/admin/dashboard/store"},
];
const salesOperations = [
    {icon: Mail, label: "Promotions", path: "/admin/dashboard/promotion-email"},
    {icon: ShoppingBag, label: "Orders", path: "/admin/dashboard/orders"},
    {icon: ChartLine, label: "Statistics", path: "/admin/dashboard/statistics"},
];

export function AppSidebar() {
    const {logout} = useAuth()

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <Link to={"/admin/dashboard"}>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                {/*<AvatarImage
                                src={data.user.avatar}
                                alt={data.user.name}
                            />*/}
                                <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {"admin"}
                      </span>
                                <span className="truncate text-xs">
                        {"admin@admin.com"}
                      </span>
                            </div>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator/>
            <SidebarContent>
                <ScrollArea>
                    <SidebarGroup>
                        <SidebarGroupLabel>Storefront Setup</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={storefront[0].path}>
                                            <Newspaper/>
                                            <span>{storefront[0].label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={storefront[1].path}>
                                            <ShoppingBag/>
                                            <span>{storefront[1].label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={storefront[2].path}>
                                            <Shirt/>
                                            <span>{storefront[2].label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={storefront[3].path}>
                                            <Store/>
                                            <span>{storefront[3].label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Sales Operations</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={salesOperations[0].path}>
                                            <Mail/>
                                            <span>{salesOperations[0].label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={salesOperations[1].path}>
                                            <ShoppingBag/>
                                            <span>{salesOperations[1].label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={salesOperations[2].path}>
                                            <ChartLine/>
                                            <span>{salesOperations[2].label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </ScrollArea>
            </SidebarContent>
            <SidebarSeparator/>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link to="/">
                                <Store />
                                Storefront
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild>
                            <Link to="/admin/dashboard/settings">
                                <UserCog/>
                                Settings
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuButton asChild onClick={() => logout()} className="hover:cursor-pointer">
                            <div>
                                <LogOut/>
                                <span>Logout</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}


