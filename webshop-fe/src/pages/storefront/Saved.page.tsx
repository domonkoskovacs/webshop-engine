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
                <EmptyState title="You don't have any saved products!"/>
            ) : (
                <PublicEmptyPage emptyStateTitle="You don't have any saved products!"
                                 buttonTitle="You need to log in to save products!"/>
            )}
        </div>
    );
};

export default Saved;
