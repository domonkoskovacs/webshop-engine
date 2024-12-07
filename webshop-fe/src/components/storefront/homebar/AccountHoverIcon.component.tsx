import React from "react";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "../../ui/HoverCard";
import {Button} from "../../ui/Button";
import {User} from "lucide-react";
import AccountHoverContent from "./AccountHoverContent.component";

const AccountHoverIcon: React.FC = () => {

    return <HoverCard>
        <HoverCardTrigger>
            <Button variant="ghost" size="icon">
                <User/>
            </Button>
        </HoverCardTrigger>
        <HoverCardContent>
            <AccountHoverContent/>
        </HoverCardContent>
    </HoverCard>

}

export default AccountHoverIcon