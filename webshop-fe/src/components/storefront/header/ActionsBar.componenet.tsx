import React from 'react';
import {Button} from 'src/components/ui/Button';
import {Heart, ShoppingCart} from 'lucide-react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import DarkModeToggle from "../../ui/DarkModeToggle";
import GenderSelector from "./GenderSelector.component";
import AccountHoverIcon from "./AccountHoverIcon.component";
import {useUser} from "../../../hooks/UseUser";
import {Badge} from "../../ui/Badge";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "../../ui/HoverCard";
import CartHoverContent from "./CartHoverContent.component";
import {useAuth} from "../../../hooks/UseAuth";

const ActionsBar: React.FC = () => {
    const navigate = useNavigate();
    const {saved, cart} = useUser()

    const location = useLocation();
    const { loggedIn } = useAuth();
    const isCartHoverDisabled = location.pathname === "/checkout" || !loggedIn;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-2 px-6 gap-4 sm:gap-2">
            <GenderSelector/>

            <Link to="/" className="text-xl font-semibold">
                <span className="cursor-pointer">Webshop Name</span>
            </Link>

            <div className="flex space-x-4 sm:space-x-2">
                <AccountHoverIcon/>
                <div className="relative">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/saved")}>
                        <Heart/>
                    </Button>
                    {saved.length > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {saved.length}
                        </Badge>
                    )}
                </div>

                <HoverCard>
                    <HoverCardTrigger>
                        <div className="relative">
                            <Button variant="ghost" size="icon" onClick={() => navigate("/cart")}>
                                <ShoppingCart/>
                            </Button>
                            {cart.length > 0 && (
                                <Badge
                                    className="absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {cart.map(item => item.count).reduce((sum, count) => sum! + count!, 0)}
                                </Badge>
                            )}
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-[50vw]" hidden={isCartHoverDisabled}>
                        <CartHoverContent/>
                    </HoverCardContent>
                </HoverCard>
                <DarkModeToggle/>
            </div>
        </div>
    );
};

export default ActionsBar;
