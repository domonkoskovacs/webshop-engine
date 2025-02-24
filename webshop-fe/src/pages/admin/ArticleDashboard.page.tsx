import React from 'react';
import {Separator} from "../../components/ui/Separator";
import ArticleHeader from "../../components/admin/article/ArticleHeader.component";
import ArticleSlider from "../../components/shared/ArticleSlider.component";

const ArticleDashboard: React.FC = () => {
    return (
        <div className="flex flex-col w-full h-full justify-start items-center">
            <ArticleHeader/>
            <Separator/>
            <div className="m-auto w-[120vh]">
                <ArticleSlider/>
            </div>
        </div>
    );
};

export default ArticleDashboard;
