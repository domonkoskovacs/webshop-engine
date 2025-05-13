import React from "react";
import {Button} from "../../ui/button.tsx";
import {LayoutDashboard, Settings, ShoppingBag, UserPen} from "lucide-react";
import {Separator} from "../../ui/separator.tsx";
import {useAuth} from "@/hooks/useAuth.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {Badge} from "../../ui/badge.tsx";
import {toLogin} from "@/lib/url.utils.ts";
import {useUser} from "@/hooks/user/useUser.ts";
import {AppPaths} from "@/routing/AppPaths.ts";

const AccountHoverContent: React.FC = () => {
    const {loggedIn, role, logout} = useAuth()
    const navigate = useNavigate();
    const { data: user } = useUser();
    const location = useLocation();

    const profileChangesNeeded = loggedIn &&
        user &&
        (!user.shippingAddress || !user.billingAddress) &&
        location.pathname !== AppPaths.PROFILE;

    if (loggedIn && role === "ROLE_USER") {
        return <div className="flex flex-col text-center space-y-1">
            <h1>Welcome back!</h1>
            <Button variant="ghost" className="flex items-center justify-start" onClick={() => navigate(AppPaths.PROFILE)}>
                <div className="relative flex items-center justify-start">
                    <UserPen className="mr-2"/>Profile
                    {profileChangesNeeded && (
                        <Badge
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-ping">
                        </Badge>
                    )}
                </div>
            </Button>
            <Button variant="ghost" className="flex items-center justify-start"
                    onClick={() => navigate(AppPaths.MY_ORDERS)}>
                <ShoppingBag className="mr-2"/>Previous orders
            </Button>
            <Separator className="my-4"/>
            <Button onClick={() => logout()}>
                Log out
            </Button>
        </div>
    }

    if (loggedIn && role === "ROLE_ADMIN") {
        return <div className="flex flex-col text-center space-y-1">
            <h1>Welcome back!</h1>
            <Button variant="ghost" className="flex items-center justify-start"
                    onClick={() => navigate(AppPaths.DASHBOARD_BASE)}>
                <LayoutDashboard className="mr-2"/>Dashboard
            </Button>
            <Button variant="ghost" className="flex items-center justify-start"
                    onClick={() => navigate(AppPaths.DASHBOARD_STORE_FULL)}>
                <Settings className="mr-2"/>Settings
            </Button>
            <Separator className="mb-4"/>
            <Button onClick={() => logout()}>
                Log out
            </Button>
        </div>;
    }

    return <div className="flex flex-col content-center text-center space-y-2 gap-2">
        <h1>You are not logged in!</h1>
        <Button onClick={() => {
            navigate(toLogin)
        }}>
            Login
        </Button>
        <Button onClick={() => {
            navigate({
                pathname: AppPaths.AUTHENTICATION,
                search: '?type=registration',
            });
        }}>
            Register
        </Button>
        <h1>Join us today!</h1>
    </div>
};

export default AccountHoverContent;
