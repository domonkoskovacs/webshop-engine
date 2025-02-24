import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {A11y, Autoplay, Navigation, Pagination} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {Button} from "../ui/Button";
import ArticleCard from "../../components/admin/article/ArticleCard.component";

const ArticleSlider: React.FC = () => {

    return (
        <div className="swiper swiper-wrapper">
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                speed={1000}
                loop={true}
                pagination={{clickable: true, el: '.custom-swiper-pagination'}}
                navigation={{
                    enabled: true,
                    nextEl: '.custom-swiper-button-next',
                    prevEl: '.custom-swiper-button-prev',
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                modules={[Pagination, Navigation, A11y, Autoplay]}
                className="h-[60vh]"
            >
                <SwiperSlide className="swiper-slide text-center flex items-center justify-center"><ArticleCard
                    image="/Strawberries.jpg"
                    text="this is the text"
                    buttonLink="/"
                    buttonText="this is the button text"/></SwiperSlide>
                <SwiperSlide className="swiper-slide text-center flex items-center justify-center"><ArticleCard
                    image="/Strawberries.jpg"
                    text="this is the text"
                    buttonLink="/"
                    buttonText="this is the button text"/></SwiperSlide>
                <SwiperSlide className="swiper-slide text-center flex items-center justify-center"><ArticleCard
                    image="/Strawberries.jpg"
                    text="this is the text"
                    buttonLink="/"
                    buttonText="this is the button text"/></SwiperSlide>
                <SwiperSlide className="swiper-slide text-center flex items-center justify-center"><ArticleCard
                    image="/Strawberries.jpg"
                    text="this is the text"
                    buttonLink="/"
                    buttonText="this is the button text"/></SwiperSlide>
            </Swiper>
            <Button variant="outline"
                    className="custom-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 p-3 z-10">
                &#10094;
            </Button>
            <Button variant="outline"
                    className="custom-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 p-3 z-10">
                &#10095;
            </Button>
            <div className="custom-swiper-pagination absolute bottom-2 right-2 z-10 space-x-1"></div>
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
                        opacity: 1
                    }
                `}</style>
        </div>

    );
}

export default ArticleSlider;