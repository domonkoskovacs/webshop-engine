import React from 'react';
import {useAuth} from "../../hooks/UseAuth";
import {useUser} from "../../hooks/UseUser";
import {ProductResponse} from "../../shared/api";
import ProductCard from "../../components/storefront/product/ProductCard.component";
import EmptyState from "../../components/storefront/shared/EmptyPage.component";
import PublicEmptyPage from "../../components/storefront/shared/PublicEmptyPage.component";
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageTitle from "../../components/shared/PageTitle";
import PageContent from "../../components/shared/PageContent";

const Saved: React.FC = () => {
    const {loggedIn} = useAuth()
    const {saved} = useUser()

    return saved.length > 0 ? (
        <PageContainer layout="spacious" className="relative self-start">
            <PageHeader>
                <PageTitle>Saved Products</PageTitle>
                <p className="text-lg font-semibold">
                    <span className="text-indigo-600">{saved.length}</span> items saved
                </p>
            </PageHeader>
            <PageContent
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {saved.map((product: ProductResponse) => {
                    return (
                        <div key={product.id}>
                            <ProductCard product={product}/>
                        </div>
                    );
                })}
            </PageContent>
        </PageContainer>
    ) : (
        <PageContainer layout="centered" className="space-y-3 py-20">
            {loggedIn ? (
                <EmptyState title="You don't have any saved products!"/>
            ) : (
                <PublicEmptyPage emptyStateTitle="You don't have any saved products!"
                                 buttonTitle="You need to log in to save products!"/>
            )}
        </PageContainer>
    );
};

export default Saved;
