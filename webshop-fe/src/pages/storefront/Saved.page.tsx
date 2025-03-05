import React from 'react';
import {Skeleton} from "../../components/ui/Skeleton";
import {useAuth} from "../../hooks/UseAuth";
import {Link} from "react-router-dom";
import {Button} from "../../components/ui/Button";
import {useUser} from "../../hooks/UseUser";
import {ProductResponse} from "../../shared/api";
import ProductCard from "../../components/storefront/product/ProductCard.component";

const Saved: React.FC = () => {
    const {loggedIn} = useAuth()
    const {saved} = useUser()

    const EmptyState = () => (
        <div className="flex flex-col space-y-3">
            <h1 className="text-center">You don't have any saved products!</h1>
            <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]"/>
                <Skeleton className="h-4 w-[200px]"/>
            </div>
        </div>
    );

    const LoggedInEmptyState = () =>
        <div className="flex flex-col gap-10 sm:flex-row justify-between items-center mb-4 p-4">
            <EmptyState/>
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


    return saved.length > 0 ? (
        <main
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-6 p-4">
            {saved.map((product: ProductResponse) => {
                return (
                    <div key={product.id}>
                        <ProductCard product={product}/>
                    </div>
                );
            })}
        </main>
    ) : (
        <div className="flex flex-col space-y-3 py-20">
            {loggedIn ? (
                <EmptyState/>
            ) : (
                <LoggedInEmptyState/>
            )}
        </div>
    );
};

export default Saved;
