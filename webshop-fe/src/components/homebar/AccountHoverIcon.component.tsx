import React, {useState} from "react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "../ui/HoverCard";
import {Button} from "../ui/Button";
import {Settings, ShoppingBag, User, UserPen} from "lucide-react";
import AuthDialogComponent from "./AuthDialog.component";
import {useAuth} from "../../hooks/UseAuth";

const AccountHoverIcon: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const {loggedIn,logout} = useAuth()

    const handleLogin = () => {
        setIsLogin(true)
        setDialogOpen(true)
    };

    const handleRegister = () => {
        setIsLogin(false)
        setDialogOpen(true)
    };
    return (
        <HoverCard>
            <HoverCardTrigger>
                <Button variant="ghost" size="icon">
                    <User/>
                </Button>
            </HoverCardTrigger>
            <HoverCardContent>
                {loggedIn?
                    <div className="flex flex-col text-center space-y-1">
                        <h1>Welcome back!</h1>
                        <Button variant="ghost" className="flex items-center justify-start">
                            <UserPen className="mr-2" />Profile
                        </Button>
                        <Button variant="ghost" className="flex items-center justify-start">
                            <ShoppingBag className="mr-2"/>Previous orders
                        </Button>
                        <Button variant="ghost" className="flex items-center justify-start">
                            <Settings className="mr-2"/>Settings
                        </Button>
                        <Button onClick={() => logout()}>
                            Log out
                        </Button>
                    </div>
                    :
                    <div className="flex flex-col content-center text-center space-y-2">
                    <h1>You are not logged in!</h1>
                    <Button onClick={handleLogin}>Login</Button>
                    <Button onClick={handleRegister}>Register</Button>
                    <h1>Join us today!</h1>
                    <AuthDialogComponent
                        open={dialogOpen}
                        setOpen={setDialogOpen}
                        isLogin={isLogin}
                        setIsLogin={setIsLogin}></AuthDialogComponent>
                </div>}
            </HoverCardContent>
        </HoverCard>
    )
}

export default AccountHoverIcon