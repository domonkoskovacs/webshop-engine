import React from "react";
import {Link} from "react-router-dom";
import {Card, CardContent, CardFooter} from "src/components/ui/Card";

interface ProductCardProps {
    id: string;
    name: string;
    brand: string;
    image: string;
    price: number;
    discount?: number;
}

const HomeProductCard: React.FC<ProductCardProps> = ({id, brand, name, image, price, discount}) => {
    const finalPrice = discount ? price - (price * discount) / 100 : price;

    return (
        <Card className="relative space-y-4 overflow-hidden hover:opacity-80">
            <div className="w-full h-64 flex items-center justify-center overflow-hidden">
                <img
                    className="w-full"
                    src={image}
                    alt={name}
                />
            </div>
            <CardContent className="px-4 py-0">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-lg">
                            <Link to={`/products/${id}`}>
                                <span aria-hidden="true" className="absolute inset-0"/>
                                {name}
                            </Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">{brand}</p>
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

