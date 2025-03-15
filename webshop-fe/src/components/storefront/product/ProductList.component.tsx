import React, {useCallback, useRef} from "react";
import {useProductScroll} from "../../../hooks/useProductScroll";
import ProductCard from "./ProductCard.component";
import {Skeleton} from "../../ui/Skeleton";
import {ProductResponse} from "../../../shared/api";

const ProductList = () => {
    const {products, loading, hasMore, fetchNextPage} = useProductScroll();
    const observer = useRef<IntersectionObserver | null>(null);

    const lastProductRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore, fetchNextPage]
    );

    const EmptyState = () => (
        <div className="flex flex-col space-y-3 py-20 items-center justify-center">
            <div className="flex flex-col space-y-3">
                <h1 className="text-center">Sorry, we have no products for <br/> the given filters!</h1>
                <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]"/>
                    <Skeleton className="h-4 w-[200px]"/>
                </div>
            </div>
        </div>
    );

    return (
        products.length < 1 ? (<EmptyState />) :
            <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {products.map((product: ProductResponse, index: number) => {
                    const isLastItem = index === products.length - 1;
                    return (
                        <div key={product.id} ref={isLastItem ? lastProductRef : null}>
                            <ProductCard product={product} />
                        </div>
                    );
                })}
                {loading && <p className="text-center col-span-full">Loading...</p>}
            </main>
    );
};

export default ProductList;
