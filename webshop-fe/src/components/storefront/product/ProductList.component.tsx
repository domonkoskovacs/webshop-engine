import React, {useCallback, useRef} from "react";
import {useProductScroll} from "../../../hooks/useProductScroll";
import ProductCard from "./ProductCard.component";
import {ProductResponse} from "../../../shared/api";
import EmptyState from "../shared/EmptyPage.component";

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

    return (
        products.length < 1 ? (<EmptyState title="Sorry, we have no products for the given filters!"/>) :
            <main
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                {products.map((product: ProductResponse, index: number) => {
                    const isLastItem = index === products.length - 1;
                    return (
                        <div key={product.id} ref={isLastItem ? lastProductRef : null}>
                            <ProductCard product={product}/>
                        </div>
                    );
                })}
                {loading && <p className="text-center col-span-full">Loading...</p>}
            </main>
    );
};

export default ProductList;
