import React from "react";
import {Link, useLocation} from "react-router-dom";
import {Card, CardContent, CardFooter} from "src/components/ui/Card";
import {Button} from "../../ui/Button";
import {HeartIcon, PlusIcon, TrashIcon} from "lucide-react";
import {ProductResponse} from "../../../shared/api";
import {useGender} from "../../../hooks/useGender";
import {useUser} from "../../../hooks/UseUser";
import {generateProductUrl} from "../../../lib/url.utils";
import {calculateDiscountedPrice} from "../../../lib/price.utils";

interface ProductCardProps {
    product: ProductResponse
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const {gender} = useGender()
    const {toggleSaved, addItemToCart, isSaved} = useUser();
    const location = useLocation();
    const isSavedPage = location.pathname === '/saved';
    const savedProduct = isSaved(product.id!);
    const finalPrice = product.price
        ? calculateDiscountedPrice(product.price, product.discountPercentage || 0)
        : 0;

    return (
        <Card className="w-full relative space-y-4 overflow-hidden">
            <figure>
                <Button
                    variant="ghost"
                    size="icon"
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
                <Link to={generateProductUrl(
                    gender, /*todo product.gender*/
                    product.category?.name,
                    product.subCategory?.name,
                    product.name,
                    product.id
                )}>
                    <img
                        className="aspect-square w-full hover:opacity-80"
                        src={product.imageUrls![0]}
                        width={300}
                        height={500}
                        alt={product.name}
                    />
                </Link>
            </figure>
            <CardContent className="px-4 py-0">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg">
                            <Link to="/products">
                                {product.name}
                            </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">{product.category?.name}</p>
                    </div>
                    <p className="text-lg font-semibold">${finalPrice.toFixed(2)}</p>
                </div>
            </CardContent>
            <CardFooter className="p-0 border-t">
                <Button variant="ghost" className="w-full" onClick={() => addItemToCart(product.id!)}>
                    <PlusIcon className="size-4 me-1"/> Add to Card
                </Button>
            </CardFooter>
        </Card>
    );

};

export default ProductCard;