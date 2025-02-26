import React, {useState} from 'react';
import {Separator} from "../../components/ui/Separator";
import ArticleHeader from "../../components/admin/article/ArticleHeader.component";
import ArticleSlider from "../../components/shared/ArticleSlider.component";

const ArticleDashboard: React.FC = () => {
    const [isAutoplay, setAutoplay] = useState(true);

    return (
        <div className="flex flex-col w-full h-full justify-start items-center">
            <ArticleHeader isAutoplay={isAutoplay} setIsAutoplay={setAutoplay}/>
            <Separator/>
            <div className="w-full max-w-[70vw] sm:max-w-[90vw] md:max-w-[65vw] lg:max-w-[70vw] mx-auto ">
                <ArticleSlider autoplayEnabled={isAutoplay} variant="admin"/>
            </div>
        </div>
    );
};

export default ArticleDashboard;
