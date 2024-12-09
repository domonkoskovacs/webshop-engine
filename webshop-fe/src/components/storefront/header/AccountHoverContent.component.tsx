import React from "react";
import {Button} from "../../ui/Button";
import {LayoutDashboard, Settings, ShoppingBag, UserPen} from "lucide-react";
import {Separator} from "../../ui/Separator";
import {useAuth} from "../../../hooks/UseAuth";
import {useNavigate} from "react-router-dom";

const AccountHoverContent: React.FC = () => {
    const {loggedIn, role, logout} = useAuth()
    const navigate = useNavigate();

    if (loggedIn && role === "ROLE_USER") {
        return <div className="flex flex-col text-center space-y-1">
            <h1>Welcome back!</h1>
            <Button variant="ghost" className="flex items-center justify-start" onClick={() => navigate("/profile")}>
                <UserPen className="mr-2"/>Profile
            </Button>
            <Button variant="ghost" className="flex items-center justify-start"
                    onClick={() => navigate("/previous-orders")}>
                <ShoppingBag className="mr-2"/>Previous orders
            </Button>
            <Button variant="ghost" className="flex items-center justify-start" onClick={() => navigate("/settings")}>
                <Settings className="mr-2"/>Settings
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
