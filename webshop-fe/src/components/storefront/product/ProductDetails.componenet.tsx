import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {ProductResponse} from "../../../shared/api";
import {useProduct} from "../../../hooks/UseProduct";
import {Button} from "../../ui/Button";
import {Swiper, SwiperSlide} from "swiper/react";
import {Thumbs} from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import PageContainer from "../shared/PageContainer.component";
import EmptyState from "../shared/EmptyPage.component";

const ProductDetails: React.FC = () => {
    const navigate = useNavigate();
    const {getById} = useProduct();
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const id = pathSegments[5] || null;

    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const response = await getById(id);
                if (response) {
                    setProduct(response);
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, getById, navigate]);

    if (loading) {
        return <EmptyState title=""/>
    }

    if (!product) {
        return (
            <PageContainer className="my-10 gap-3">
                <h1 className="text-5xl font-bold text-red-600">404</h1>
                <p className="text-2xl">Product Not Found</p>
                <p className="text-2xl">The product you are looking for does not exist.</p>
                <Button onClick={() => navigate("/products")}>Go to Products</Button>
            </PageContainer>
        );
    }

    return (
        <PageContainer layout="readable" className="swiper">
            <div className="flex-1">
                <Swiper
                    modules={[Thumbs]}
                    thumbs={{swiper: thumbsSwiper}}
                    spaceBetween={10}
                    className="mb-4 h-[400px]"
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
                <Swiper
                    onSwiper={setThumbsSwiper}
                    modules={[Thumbs]}
                    spaceBetween={10}
                    slidesPerView={5}
                    watchSlidesProgress
                    className="mt-2 h-[100px]"
                >
                    {product.imageUrls &&
                        product.imageUrls.map((url, index) => (
                            <SwiperSlide key={index} className="h-full">
                                <img
                                    src={url}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover rounded cursor-pointer"
                                />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-lg mb-4">{product.description}</p>
                <p className="text-xl font-semibold mb-4">Price: ${product.price}</p>
                <Button onClick={() => navigate("/products")} className="mt-4">
                    Back to Products
                </Button>
            </div>
        </PageContainer>
    );
};

export default ProductDetails;
