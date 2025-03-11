import React from 'react';
import {useAuth} from "../../hooks/UseAuth";
import {useUser} from "../../hooks/UseUser";
import {ProductResponse} from "../../shared/api";
import ProductCard from "../../components/storefront/product/ProductCard.component";
import EmptyState from "../../components/storefront/shared/EmptyPage.component";
import PublicEmptyPage from "../../components/storefront/shared/PublicEmptyPage.component";

const Saved: React.FC = () => {
    const {loggedIn} = useAuth()
    const {saved} = useUser()

    return saved.length > 0 ? (
        <main className="w-full mx-10 mb-6 relative">
            <div className="flex flex-row justify-between  my-6">
                <h1 className="text-2xl font-bold">Saved Products</h1>
                <p className="text-lg font-semibold">
                    <span className="text-indigo-600">{saved.length}</span> items saved
                </p>
            </div>
            <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {saved.map((product: ProductResponse) => {
                    return (
                        <div key={product.id}>
                            <ProductCard product={product}/>
                        </div>
                    );
                })}
            </div>

        </main>
    ) : (
        <div className="flex flex-col space-y-3 py-20">
            {loggedIn ? (
                <EmptyState title="You don't have any saved products!"/>
            ) : (
                <PublicEmptyPage emptyStateTitle="You don't have any saved products!"
                                 buttonTitle="You need to log in to save products!"/>
            )}
        </div>
    );
};

export default Saved;
