import React from 'react';

import 'swiper/css';
import ArticleSlider from "../../components/shared/ArticleSlider.component";
import HomeProductBlock from "../../components/storefront/home/ProductBlock.component";
import {useCategory} from "../../hooks/UseCategory";
import PageContainer from "../../components/storefront/shared/PageContainer.component";

const Home: React.FC = () => {
    const {categories} = useCategory()

    return (
        <PageContainer className="swiper">
            <ArticleSlider/>
            {categories.map((category) => (
                <HomeProductBlock key={category.id} category={category.name ?? ''}/>
            ))}
        </PageContainer>
    );
};

export default Home;
