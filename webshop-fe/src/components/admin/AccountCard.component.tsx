import React from "react";
import {Card, CardDescription, CardTitle} from "../ui/Card";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/Avatar";

const AccountCard: React.FC = () => {

    return (
        <Card className="flex items-center m-2 shadow-md bg-background p-2">
            <Avatar className="w-8 h-8 m-2">
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-sm font-semibold">Admin Name</CardTitle>
                <CardDescription className="text-xs opacity-80">Admin
                    Role</CardDescription>
                <CardDescription
                    className="text-xs opacity-80">admin@example.com</CardDescription>
            </div>
        </Card>
    );
}

export default AccountCard