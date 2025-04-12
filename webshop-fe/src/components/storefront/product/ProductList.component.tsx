import React, {useCallback, useRef} from "react";
import ProductCard from "./ProductCard.component";
import {ProductResponse} from "../../../shared/api";
import EmptyState from "../shared/EmptyPage.component";
import {useProductScroll} from "../../../hooks/product/useProductScroll";

interface ProductListProps {
    filters: Parameters<typeof useProductScroll>[0];
}

const ProductList: React.FC<ProductListProps> = ({filters}) => {
    const {
        data,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
    } = useProductScroll(filters);
    const products = data?.products ?? [];
    const hasMore = data ? data.totalElements > products.length : false;
    const observer = useRef<IntersectionObserver | null>(null);

    const lastProductRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isFetchingNextPage || isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, isLoading, hasMore, fetchNextPage]
    );

    if (!isLoading && products.length < 1) {
        return <EmptyState title="Sorry, we have no products for the given filters!"/>;
    }

    return (
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
            {(isLoading || isFetchingNextPage) && (
                <p className="text-center col-span-full">Loading...</p>
            )}
        </main>
    );
};

export default ProductList;
