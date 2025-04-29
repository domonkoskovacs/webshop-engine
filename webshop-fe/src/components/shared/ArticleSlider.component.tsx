import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Button } from '../ui/button';
import ArticleCard from './ArticleCard.component';
import { useArticles } from '@/hooks/article/useArticles';

interface ArticleSliderProps {
    autoplayEnabled?: boolean;
    variant?: 'admin' | 'storefront';
}

const ArticleSlider: React.FC<ArticleSliderProps> = ({ autoplayEnabled = true, variant }) => {
    const { data: articles = [], isLoading, isError } = useArticles();
    const hasMultipleArticles = articles.length > 1;

    if (isLoading) return <div>Loading articles...</div>;
    if (isError) return <div>Error loading articles.</div>;

    return (
        <div className="swiper">
            <Swiper
                slidesPerView={1}
                speed={1000}
                loop={hasMultipleArticles}
                pagination={
                    hasMultipleArticles
                        ? { clickable: true, el: '.custom-swiper-pagination' }
                        : false
                }
                navigation={
                    hasMultipleArticles
                        ? {
                            enabled: true,
                            nextEl: '.custom-swiper-button-next',
                            prevEl: '.custom-swiper-button-prev',
                        }
                        : false
                }
                autoplay={
                    hasMultipleArticles && autoplayEnabled
                        ? {
                            delay: 2500,
                            disableOnInteraction: false,
                        }
                        : false
                }
                modules={[Pagination, Navigation, A11y, Autoplay]}
                className="h-[80vh]"
            >
                {articles.map((article) => (
                    <SwiperSlide
                        key={article.id}
                        className="swiper-slide text-center flex items-center justify-center"
                    >
                        <ArticleCard
                            id={article.id ?? ''}
                            image={article.imageUrl || '/default.jpg'}
                            text={article.text ?? ''}
                            buttonLink={article.buttonLink || '#'}
                            buttonText={article.buttonText || 'Read More'}
                            variant={variant}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {hasMultipleArticles && (
                <>
                    <Button
                        variant="outline"
                        className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 p-3 z-10"
                    >
                        &#10094;
                    </Button>
                    <Button
                        variant="outline"
                        className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 p-3 z-10"
                    >
                        &#10095;
                    </Button>
                    <div className="custom-swiper-pagination absolute bottom-2 right-2 z-10 space-x-1" />
                </>
            )}

            <style>{`
        .swiper-pagination-bullet {
          width: 15px;
          height: 15px;
          opacity: 0.5;
        }
        .swiper-pagination {
          margin-top: 10px;
        }
        .swiper-pagination-bullet-active {
          background-color: black;
          opacity: 1;
        }
      `}</style>
        </div>
    );
};

export default ArticleSlider;
