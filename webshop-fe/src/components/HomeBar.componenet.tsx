import React, {useState} from 'react';
import {Button} from 'src/components/ui/Button';
import {Heart, ShoppingCart, User} from 'lucide-react';
import {Link} from 'react-router-dom';
import {HoverCard, HoverCardContent, HoverCardTrigger,} from "src/components/ui/HoverCard"
import DarkModeToggle from "./ui/DarkModeToggle";
import AuthDialogComponent from "./AuthDialog.component";
import {Gender} from "../shared/types";
import {useToast} from "../hooks/UseToast";

const HomeBar: React.FC = () => {
    const [gender, setGender] = useState<Gender>('men');
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const {toast} = useToast()

    const handleGenderChange = (selectedGender: Gender) => {
        setGender(selectedGender);
    };

    const handleLogin = () => {
        setIsLogin(true)
        setDialogOpen(true)
    };

    const handleRegister = () => {
        setIsLogin(false)
        setDialogOpen(true)
    };

    return (
        <div className="flex justify-between items-center py-4 px-8 bg-background shadow-md">
            <div className="flex">
                <Button
                    variant="ghost"
                    className={`${
                        gender === 'men' ? 'font-bold text-lg' : 'text-lg opacity-50'
                    }`}
                    onClick={() => handleGenderChange('men')}
                >
                    Men
                </Button>
                <Button
                    variant="ghost"
                    className={`${
                        gender === 'women' ? 'font-bold text-lg' : 'text-lg opacity-50'
                    }`}
                    onClick={() => handleGenderChange('women')}
                >
                    Women
                </Button>
            </div>

            <Link to="/" className="text-xl font-semibold">
                <span className="cursor-pointer">Webshop Name</span>
            </Link>

            <div className="flex space-x-3">
                <HoverCard>
                    <HoverCardTrigger>
                        <Button variant="ghost" size="icon">
                            <User/>
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent>
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
                        </div>
                    </HoverCardContent>
                </HoverCard>
                <Button variant="ghost" size="icon">
                    <Heart/>
                </Button>
                <Button variant="ghost" size="icon">
                    <ShoppingCart/>
                </Button>
                <DarkModeToggle/>
            </div>
        </div>
    );
};

export default HomeBar;
