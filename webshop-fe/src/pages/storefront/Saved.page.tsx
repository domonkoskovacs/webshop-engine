import React from 'react';
import {Skeleton} from "../../components/ui/Skeleton";
import {useAuth} from "../../hooks/UseAuth";
import {Link} from "react-router-dom";
import {Button} from "../../components/ui/Button";

const Saved: React.FC = () => {
    const {loggedIn} = useAuth()
    return (
        <div className="flex flex-col space-y-3 py-20">
            {loggedIn ? (
                <>
                    <h1 className="text-center">You don't have any saved products!</h1>
                    <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]"/>
                        <Skeleton className="h-4 w-[200px]"/>
                    </div>
                </>
            ) : (
                <div className="flex flex-col gap-10 sm:flex-row justify-between items-center mb-4 p-4">
                    <div className="flex flex-col space-y-3">
                        <h1 className="text-center">You don't have any saved products!</h1>
                        <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]"/>
                            <Skeleton className="h-4 w-[200px]"/>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-center text-xl">
                            You need to log in <br/> to save products!
                        </h1>
                        <div className="flex justify-center my-4">
                            <Link to="/authentication?type=login">
                                <Button>
                                    Log In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Saved;
