import React from "react";
import {Link, useLocation} from "react-router-dom";
import {Card, CardContent, CardFooter} from "src/components/ui/Card";
import {Button} from "../../ui/Button";
import {HeartIcon, PlusIcon, TrashIcon} from "lucide-react";
import {ProductResponse, ProductResponseGenderEnum} from "../../../shared/api";
import {useGender} from "../../../hooks/useGender";
import {generateProductListUrl, generateProductUrl} from "../../../lib/url.utils";
import {calculateDiscountedPrice} from "../../../lib/price.utils";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import {Badge} from "../../ui/Badge";
import {useUpdateCart} from "../../../hooks/user/useUpdateCart";
import {useAuth} from "../../../hooks/UseAuth";
import {useModifySaved} from "../../../hooks/user/useModifySaved";
import {useSaved} from "../../../hooks/user/useSaved";
import {useCart} from "../../../hooks/user/useCart";
import {useUserOrders} from "../../../hooks/user/useUserOrders";

interface ProductCardProps {
    product: ProductResponse;
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const {gender} = useGender();
    const {isInCart} = useCart();
    const {isOrdered} = useUserOrders();
    const {addItemToCart, isPending} = useUpdateCart();
    const {loggedIn} = useAuth()
    const {isSaved} = useSaved();
    const {toggleSaved, isToggling} = useModifySaved();
    const location = useLocation();
    const isSavedPage = location.pathname === "/saved";
    const savedProduct = isSaved(product.id!);
    const fullPrice = product.price || 0;
    const discountedPrice = product.discountPercentage && product.discountPercentage > 0
        ? calculateDiscountedPrice(fullPrice, product.discountPercentage)
        : fullPrice;
    const productUrlGender =
        product.gender && product.gender !== ProductResponseGenderEnum.Unisex
            ? product.gender.toLowerCase()
            : gender;

    return (
        <Card className="w-full relative space-y-4 overflow-hidden">
            <figure className="relative">
                <div className="absolute top-3 left-3 flex flex-col gap-2 items-start z-20">
                    {(product.discountPercentage ?? 0) > 0 && (
                        <Badge variant="destructive" className="w-auto">
                            -{product.discountPercentage}%
                        </Badge>
                    )}
                    {(product.count ?? 0) <= 0 && (
                        <Badge variant="secondary" className="w-auto">
                            Out of Stock
                        </Badge>
                    )}
                    {(product.count ?? 0) > 0 && (product.count ?? 0) <= 10 && (
                        <Badge variant="warning" className="w-auto">
                            Only {product.count} left!
                        </Badge>
                    )}
                    {product.creationTime && new Date(product.creationTime) >= new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) && (
                        <Badge variant="info" className="w-auto">
                            New
                        </Badge>
                    )}
                    {isOrdered(product.id!) && (
                        <Badge variant="info">Ordered</Badge>
                    )}
                    {isInCart(product.id!) && (
                        <Badge variant="default">In Cart</Badge>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isToggling}
                    onClick={() => toggleSaved(product.id!)}
                    className={`absolute top-3 end-3 rounded-full z-10 transition ${
                        isSavedPage ? "" : savedProduct ? "bg-red-500" : "hover:bg-red-500"
                    }`}
                >
                    {isSavedPage ? (
                        <TrashIcon className="w-5 h-5"/>
                    ) : (
                        <HeartIcon className="w-5 h-5"/>
                    )}
                </Button>
                <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    className="w-full h-full"
                >
                    {product.imageUrls?.map((url, index) => (
                        <SwiperSlide key={index}>
                            <Link
                                to={generateProductUrl(
                                    productUrlGender,
                                    product.category?.name,
                                    product.subCategory?.name,
                                    product.name,
                                    product.id
                                )}
                            >
                                <img
                                    className="aspect-square w-full hover:opacity-80"
                                    src={url}
                                    width={300}
                                    height={500}
                                    alt={product.name}
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </figure>
            <CardContent className="px-4 py-0">
                <div className="flex justify-between">
                    <div>
                        {product.brand?.name && (
                            <Link
                                to={generateProductListUrl(productUrlGender, "", "",
                                    {brand: product.brand?.name}
                                )}
                            >
                                <p className="text-sm font-bold hover:underline cursor-pointer">
                                    {product.brand.name}
                                </p>
                            </Link>
                        )}
                        <h3 className="text-lg">
                            <Link to={generateProductUrl(
                                productUrlGender,
                                product.category?.name,
                                product.subCategory?.name,
                                product.name,
                                product.id
                            )}>{product.name}</Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            <Link to={generateProductListUrl(
                                gender,
                                product.category?.name,
                                product.subCategory?.name,
                            )}>
                                {product.subCategory?.name || product.category?.name}
                            </Link>
                        </p>
                    </div>
                    <div className="flex flex-col justify-center text-right">
                        {product.discountPercentage && product.discountPercentage > 0 ? (
                            <>
                                <p className="text-lg text-gray-500 line-through">
                                    ${fullPrice.toFixed(2)}
                                </p>
                                <p className="text-lg font-semibold text-red-600">
                                    ${discountedPrice.toFixed(2)}
                                </p>
                            </>
                        ) : (
                            <p className="text-lg font-semibold">
                                ${fullPrice.toFixed(2)}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-0 border-t">
                <Button
                    variant="ghost"
                    className="w-full"
                    disabled={isPending}
                    onClick={() => addItemToCart(product.id!, loggedIn)}
                >
                    <PlusIcon className="size-4 me-1"/> Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ProductCard;
