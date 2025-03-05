import React from "react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "../../ui/HoverCard";
import {Button} from "../../ui/Button";
import {User} from "lucide-react";
import AccountHoverContent from "./AccountHoverContent.component";
import {useUser} from "../../../hooks/UseUser";
import {Badge} from "../../ui/Badge";
import {useAuth} from "../../../hooks/UseAuth";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "../../ui/Tooltip";
import {useLocation} from "react-router-dom";

const AccountHoverIcon: React.FC = () => {
    const {user} = useUser()
    const {loggedIn} = useAuth()
    const location = useLocation();

    const profileChangesNeeded = loggedIn &&
        (!user.shippingAddress || !user.billingAddress) &&
        location.pathname !== "/profile";
    return <HoverCard>
        <HoverCardTrigger>
            <TooltipProvider>
                <div className="relative">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <User/>
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
            </TooltipProvider>
        </HoverCardTrigger>
        <HoverCardContent>
            <AccountHoverContent/>
        </HoverCardContent>
    </HoverCard>

}

export default AccountHoverIcon