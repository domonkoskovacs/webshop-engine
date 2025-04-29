import React from 'react';
import {Button} from '@/components/ui/button';
import {Heart, ShoppingCart} from 'lucide-react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import DarkModeToggle from "@/components/ui/dark-mode-toggle.tsx";
import GenderSelector from "./GenderSelector.component";
import AccountHoverIcon from "./AccountHoverIcon.component";
import {Badge} from "../../ui/badge";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import CartHoverContent from "./CartHoverContent.component";
import {useAuth} from "@/hooks/useAuth.ts";
import {usePublicStore} from "@/hooks/store/usePublicStore.ts";
import {useCart} from "@/hooks/user/useCart.ts";
import {useSaved} from "@/hooks/user/useSaved.ts";
import {AppPaths} from "@/routing/AppPaths.ts";

const ActionsBar: React.FC = () => {
    const navigate = useNavigate();
    const {saved = []} = useSaved();
    const {cart} = useCart();
    const {data: store} = usePublicStore();
    const location = useLocation();
    const {loggedIn} = useAuth();
    const isCartHoverDisabled = location.pathname === "/checkout" || !loggedIn;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center py-2 px-6 gap-4 sm:gap-2">
            <GenderSelector/>

            <Link to={AppPaths.HOME} className="text-xl font-semibold">
                <span className="cursor-pointer">{store?.name}</span>
            </Link>

            <div className="flex space-x-4 sm:space-x-2">
                <AccountHoverIcon/>
                <div className="relative">
                    <Button variant="ghost" size="icon" onClick={() => navigate(AppPaths.SAVED_PRODUCTS)}>
                        <Heart className="scale-125"/>
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
                            <Button variant="ghost" onClick={() => navigate(AppPaths.CART_ITEMS)}>
                                <ShoppingCart className="scale-125" />
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
                <DarkModeToggle className="scale-125"/>
            </div>
        </div>
    );
};

export default ActionsBar;
