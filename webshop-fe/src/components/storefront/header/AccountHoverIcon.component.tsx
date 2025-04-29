import React from "react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "../../ui/hover-card";
import {Button} from "../../ui/button";
import {User} from "lucide-react";
import AccountHoverContent from "./AccountHoverContent.component";
import {Badge} from "../../ui/badge";
import {useAuth} from "@/hooks/useAuth.ts";
import {Tooltip, TooltipContent, TooltipTrigger} from "../../ui/tooltip";
import {useLocation} from "react-router-dom";
import {useUser} from "@/hooks/user/useUser.ts";
import {AppPaths} from "@/routing/AppPaths.ts";

const AccountHoverIcon: React.FC = () => {
    const {data: user} = useUser();
    const {loggedIn, role} = useAuth()
    const location = useLocation();

    const profileChangesNeeded = loggedIn && role !== "ROLE_ADMIN" &&
        user && (!user.shippingAddress || !user.billingAddress) &&
        location.pathname !== AppPaths.PROFILE;

    return <HoverCard>
        <HoverCardTrigger>
            <div className="relative">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <User className="scale-125"/>
                        </Button>
                    </TooltipTrigger>
                    {profileChangesNeeded && (
                        <TooltipContent>
                            <span>You need to update your account info</span>
                        </TooltipContent>
                    )}
                </Tooltip>

                {profileChangesNeeded && (
                    <Badge
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs animate-ping">
                    </Badge>
                )}
            </div>
        </HoverCardTrigger>
        <HoverCardContent>
            <AccountHoverContent/>
        </HoverCardContent>
    </HoverCard>

}

export default AccountHoverIcon