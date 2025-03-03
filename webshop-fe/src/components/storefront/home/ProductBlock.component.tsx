import React, {useEffect, useState} from "react";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Button} from "../../ui/Button";
import HomeProductCard from "./HomeProductCard.component";
import {Link} from "react-router-dom";
import {useProduct} from "../../../hooks/UseProduct";
import {ProductResponse} from "../../../shared/api";
import SkeletonProductCard from "./SkeletonCard.component";
import {useGender} from "../../../hooks/useGender";

interface ProductSwiperProps {
    category: string;
}

const marketingPhrases = [
    "Explore the latest trends in",
    "Discover your next favorite item in",
    "Browse through top picks for",
    "Uncover exclusive deals in",
    "Step into the world of",
    "Find your perfect match in"
];

const seeAllPhrases = [
    "See All Products",
    "Browse Our Full Collection",
    "Explore More Items",
    "View the Entire Range",
    "Discover All Options"
];

const HomeProductBlock: React.FC<ProductSwiperProps> = ({category}) => {
    const {getProductsByCategory} = useProduct()
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const {gender} = useGender()

    useEffect(() => {
        setLoading(true);
        getProductsByCategory(category)
            .then(fetchedProducts => setProducts(fetchedProducts))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [category, getProductsByCategory]);

    const randomMarketingText = marketingPhrases[Math.floor(Math.random() * marketingPhrases.length)];
    const randomSeeAllText = seeAllPhrases[Math.floor(Math.random() * seeAllPhrases.length)];

    return (
        <div>
            <div className="flex flex-col gap-3 sm:flex-row justify-between items-center mb-4 p-4">
                <h2 className="text-xl font-semibold text-center">{randomMarketingText} {category}</h2>
                <Button>
                    <Link to={`/products/${gender}/${category}`}>
                        {randomSeeAllText}
                    </Link>
                </Button>
            </div>
            <div
                className="grid grid-cols-1 mx-16 sm:grid-cols-2 sm:mx-8 md:grid-cols-4 md:mx-2 gap-4 mb-10 place-items-center">
                {loading ? (
                    Array.from({length: 4}).map((_, index) => <SkeletonProductCard key={index}/>)
                ) : (
                    products.length > 0 ? (
                        products.slice(0, 4).map(product => (
                            <HomeProductCard product={product}/>
                        ))
                    ) : (
                        Array.from({length: 4}).map((_, index) => <SkeletonProductCard key={index}/>)
                    )
                )}
            </div>
        </div>
    );
};

export default HomeProductBlock;
