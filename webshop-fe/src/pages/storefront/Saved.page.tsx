import React from 'react';
import {Skeleton} from "../../components/ui/Skeleton";

const Saved: React.FC = () => {
    return (
        <div className="flex flex-col space-y-3 py-20">
            <h1 className="text-center">You don't have any saved products!</h1>
            <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]"/>
                <Skeleton className="h-4 w-[200px]"/>
            </div>
        </div>
    );
};

export default Saved;
