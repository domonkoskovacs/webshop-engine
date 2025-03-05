import React from "react";
import {Button} from "../../ui/Button";
import {LayoutDashboard, Settings, ShoppingBag, UserPen} from "lucide-react";
import {Separator} from "../../ui/Separator";
import {useAuth} from "../../../hooks/UseAuth";
import {useLocation, useNavigate} from "react-router-dom";
import {useUser} from "../../../hooks/UseUser";
import {Badge} from "../../ui/Badge";

const AccountHoverContent: React.FC = () => {
    const {loggedIn, role, logout} = useAuth()
    const navigate = useNavigate();
    const {user} = useUser()
    const location = useLocation();

    const profileChangesNeeded = loggedIn &&
        (!user.shippingAddress || !user.billingAddress) &&
        location.pathname !== "/profile";
    if (loggedIn && role === "ROLE_USER") {
        return <div className="flex flex-col text-center space-y-1">
            <h1>Welcome back!</h1>
            <Button variant="ghost" className="flex items-center justify-start" onClick={() => navigate("/profile")}>
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
                    onClick={() => navigate("/previous-orders")}>
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
                    onClick={() => navigate("/admin/dashboard")}>
                <LayoutDashboard className="mr-2"/>Dashboard
            </Button>
            <Button variant="ghost" className="flex items-center justify-start"
                    onClick={() => navigate("/admin/dashboard/settings")}>
                <Settings className="mr-2"/>Settings
            </Button>
            <Separator className="my-4"/>
            <Button onClick={() => logout()}>
                Log out
            </Button>
        </div>;
    }

    return <div className="flex flex-col content-center text-center space-y-2">
        <h1>You are not logged in!</h1>
        <Button onClick={() => {
            navigate("/authentication?type=login")
        }}>
            Login
        </Button>
        <Button onClick={() => {
            navigate("/authentication?type=registration")
        }}>
            Register
        </Button>
        <h1>Join us today!</h1>
    </div>
};

export default AccountHoverContent;
