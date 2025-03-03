import React from "react";
import {Link} from "react-router-dom";
import {Card, CardContent, CardFooter} from "src/components/ui/Card";
import {ProductResponse} from "../../../shared/api";
import {useGender} from "../../../hooks/useGender";

interface ProductCardProps {
   product: ProductResponse
}

const HomeProductCard: React.FC<ProductCardProps> = ({product}) => {
    const finalPrice = product.discountPercentage && product.price ? product.price - (product.price * product.discountPercentage) / 100 : product.price ?? 0;
    const {gender} = useGender()

    return (
        <Card className="w-full relative space-y-4 overflow-hidden hover:opacity-80">
            <div className="w-full h-64 flex items-center justify-center overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={product.imageUrls![0]}
                    alt={product.name}
                />
            </div>
            <CardContent className="px-4 py-0">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg">
                            <Link to={`/products/${gender}/${product.category?.name}/${product.subCategory?.name}/${product.name}/${product.id}`}> {/*todo product.gender*/}
                                <span aria-hidden="true" className="absolute inset-0"/>
                                {product.name}
                            </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">{product.brand?.name}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">${finalPrice.toFixed(2)}</p>
                    </div>

                </div>
            </CardContent>
            <CardFooter className="p-0 border-t">
            </CardFooter>
        </Card>
    );

};

export default HomeProductCard;

