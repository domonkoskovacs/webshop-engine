import {Card, CardContent, CardFooter} from "src/components/ui/Card";
import React from "react";
import {Skeleton} from "src/components/ui/Skeleton";

const SkeletonProductCard: React.FC = () => {
    return (
        <Card className="w-full space-y-4 overflow-hidden hover:opacity-80">
            <Skeleton className=" h-64 flex items-center justify-center overflow-hidden"/>
            <CardContent className="px-4 py-0">
                <div className="flex justify-between">
                    <div>
                        <Skeleton className="w-32 h-6 bg-gray-400 mb-2"/>
                        <Skeleton className="w-20 h-4 bg-gray-400"/>
                    </div>
                    <div className="mx-2">
                        <Skeleton className="w-16 h-6"/>
                    </div>

                </div>
            </CardContent>
            <CardFooter className="p-0 border-t">
            </CardFooter>
        </Card>
    );
};

export default SkeletonProductCard;