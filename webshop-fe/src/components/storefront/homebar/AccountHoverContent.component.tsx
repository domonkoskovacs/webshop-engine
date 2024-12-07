import React, {useState} from "react";
import {Button} from "../../ui/Button";
import {LayoutDashboard, Settings, ShoppingBag, UserPen} from "lucide-react";
import {Separator} from "../../ui/Separator";
import AuthDialogComponent from "./AuthDialog.component";
import {useAuth} from "../../../hooks/UseAuth";
import {useNavigate} from "react-router-dom";

const AccountHoverContent: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const {loggedIn, role, logout} = useAuth()
    const navigate = useNavigate();

    const handleLogin = () => {
        setIsLogin(true)
        setDialogOpen(true)
    };

    const handleRegister = () => {
        setIsLogin(false)
        setDialogOpen(true)
    };

    if (loggedIn && role == "ROLE_USER") {
        return <div className="flex flex-col text-center space-y-1">
            <h1>Welcome back!</h1>
            <Button variant="ghost" className="flex items-center justify-start">
                <UserPen className="mr-2"/>Profile
            </Button>
            <Button variant="ghost" className="flex items-center justify-start">
                <ShoppingBag className="mr-2"/>Previous orders
            </Button>
            <Button variant="ghost" className="flex items-center justify-start">
                <Settings className="mr-2"/>Settings
            </Button>
            <Separator className="my-4"/>
            <Button onClick={() => logout()}>
                Log out
            </Button>
        </div>
    }

    if (loggedIn && role == "ROLE_ADMIN") {
        return <div className="flex flex-col text-center space-y-1">
            <h1>Welcome back!</h1>
            <Button variant="ghost" className="flex items-center justify-start" onClick={() => navigate("/admin/dashboard")}>
                <LayoutDashboard className="mr-2"/>Dashboard
            </Button>
            <Button variant="ghost" className="flex items-center justify-start">
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
        <Button onClick={handleLogin}>Login</Button>
        <Button onClick={handleRegister}>Register</Button>
        <h1>Join us today!</h1>
        <AuthDialogComponent
            open={dialogOpen}
            setOpen={setDialogOpen}
            isLogin={isLogin}
            setIsLogin={setIsLogin}></AuthDialogComponent>
    </div>
};

export default AccountHoverContent;
