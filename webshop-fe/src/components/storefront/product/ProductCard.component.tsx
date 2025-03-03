import React from "react";
import {Link} from "react-router-dom";
import {Card, CardContent, CardFooter} from "src/components/ui/Card";
import {Button} from "../../ui/Button";
import {HeartIcon, PlusIcon} from "lucide-react";
import {ProductResponse} from "../../../shared/api";
import {useGender} from "../../../hooks/useGender";

interface ProductCardProps {
    product: ProductResponse
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const finalPrice = product.discountPercentage && product.price ? product.price - (product.price * product.discountPercentage) / 100 : product.price ?? 0;
    const {gender} = useGender()

    return (
        <Card className="relative space-y-4 overflow-hidden">
            <figure>
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/70 absolute top-3 end-3 rounded-full dark:text-black hover:bg-red-500 z-10">
                    <HeartIcon className="size-4" />
                </Button>
                <Link to={`/products/${gender}/${product.category?.name}/${product.subCategory?.name}/${product.name}/${product.id}`}>{/*todo product.gender*/}
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
                <Button variant="ghost" className="w-full">
                    <PlusIcon className="size-4 me-1" /> Add to Card
                </Button>
            </CardFooter>
        </Card>
    );

};

export default ProductCard;