import React from 'react';

import 'swiper/css';
import ArticleSlider from "../../components/shared/ArticleSlider.component";

const Home: React.FC = () => {
    return (
        <div className="flex flex-col swiper">
            <ArticleSlider/>
        </div>
    );
};

export default Home;
