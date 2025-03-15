import React from 'react';

import 'swiper/css';
import ArticleSlider from "../../components/shared/ArticleSlider.component";
import HomeProductBlock from "../../components/storefront/home/ProductBlock.component";
import {useCategory} from "../../hooks/UseCategory";
import StorefrontPageContainer from "../../components/storefront/shared/DashboardPageContainer.component";

const Home: React.FC = () => {
    const {categories} = useCategory()

    return (
        <StorefrontPageContainer className="swiper">
            <ArticleSlider/>
            {categories.map((category) => (
                <HomeProductBlock key={category.id} category={category.name ?? ''}/>
            ))}
        </StorefrontPageContainer>
    );
};

export default Home;
