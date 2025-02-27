import React from 'react';

import 'swiper/css';
import ArticleSlider from "../../components/shared/ArticleSlider.component";
import HomeProductBlock from "../../components/storefront/home/ProductBlock.component";
import {useCategory} from "../../hooks/UseCategory";

const Home: React.FC = () => {
    const {categories} = useCategory()

    return (
        <div className="flex flex-col cursor-default swiper">
            <ArticleSlider/>
            {categories.map((category) => (
                <HomeProductBlock key={category.id} category={category.name ?? ''}/>
            ))}
        </div>
    );
};

export default Home;
