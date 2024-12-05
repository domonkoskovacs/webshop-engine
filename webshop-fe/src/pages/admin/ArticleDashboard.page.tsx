import React from 'react';
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from 'src/components/ui/Carousel';
import {Separator} from "../../components/ui/Separator";
import ArticleCard from "../../components/admin/article/ArticleCard.component";
import ArticleHeader from "../../components/admin/article/ArticleHeader.component";

const ArticleDashboard: React.FC = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ArticleHeader/>
            <Separator/>
            <div className="flex items-center justify-center flex-1 overflow-hidden">
                <Carousel>
                    <CarouselContent className="max-w-4xl">
                        {Array.from({length: 5}).map((_, index) => (
                            <CarouselItem key={index}>
                                <ArticleCard image="/Strawberries.jpg"
                                             text="this is the text"
                                             buttonLink="/"
                                             buttonText="this is the button text"/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </div>
        </div>
    );
};

export default ArticleDashboard;
