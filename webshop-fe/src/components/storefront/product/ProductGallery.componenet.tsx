import React, {useState} from "react";
import {ProductResponse} from "../../../shared/api";
import {Swiper, SwiperSlide} from "swiper/react";
import {Thumbs} from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";

interface ProductCardProps {
    product: ProductResponse
}

const ProductGallery: React.FC<ProductCardProps> = ({product}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    return (
        <div className="flex flex-col justify-center sm:flex-row gap-4">
            <div className="hidden sm:flex flex-col gap-2">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    modules={[Thumbs]}
                    direction="vertical"
                    spaceBetween={10}
                    slidesPerView={5}
                    watchSlidesProgress
                    className="h-[500px] w-[100px]"
                >
                    {product.imageUrls &&
                        product.imageUrls.map((url, index) => (
                            <SwiperSlide key={index} className="h-[60px]">
                                <img
                                    src={url}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover rounded cursor-pointer"
                                />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
            <div className="w-full swiper">
                <Swiper
                    modules={[Thumbs]}
                    thumbs={{swiper: thumbsSwiper}}
                    spaceBetween={10}
                    className="h-[500px] w-full max-w-[400px] mx-auto"
                >
                    {product.imageUrls &&
                        product.imageUrls.map((url, index) => (
                            <SwiperSlide key={index} className="h-full">
                                <img
                                    src={url}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded"
                                />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ProductGallery;
