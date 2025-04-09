import React from 'react';

import 'swiper/css';
import ArticleSlider from "../../components/shared/ArticleSlider.component";
import HomeProductBlock from "../../components/storefront/home/ProductBlock.component";
import PageContainer from "../../components/shared/PageContainer.component";
import {useCategories} from "../../hooks/category/useCategories";

const Home: React.FC = () => {
    const {data: categories = []} = useCategories();

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
