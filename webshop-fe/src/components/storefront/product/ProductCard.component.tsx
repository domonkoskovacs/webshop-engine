import React from "react";
import {Link, useLocation} from "react-router-dom";
import {Card, CardContent, CardFooter} from "src/components/ui/Card";
import {Button} from "../../ui/Button";
import {HeartIcon, PlusIcon, TrashIcon} from "lucide-react";
import {ProductResponse, ResultEntryReasonCodeEnum} from "../../../shared/api";
import {useGender} from "../../../hooks/useGender";
import {useUser} from "../../../hooks/UseUser";
import {useAuth} from "../../../hooks/UseAuth";
import {toast} from "../../../hooks/UseToast";
import {ApiError} from "../../../shared/ApiError";
import {generateProductUrl} from "../../../lib/url.utils";

interface ProductCardProps {
    product: ProductResponse
}

const ProductCard: React.FC<ProductCardProps> = ({product}) => {
    const finalPrice = product.discountPercentage && product.price ? product.price - (product.price * product.discountPercentage) / 100 : product.price ?? 0;
    const {gender} = useGender()
    const {addToSaved, removeFromSaved, isSaved, increaseOneInCart} = useUser();
    const {loggedIn} = useAuth();
    const location = useLocation();
    const isSavedPage = location.pathname === '/saved';

    const savedProduct = isSaved(product.id!);

    const handleSaveToggle = async () => {
        if (!loggedIn) {
            toast({description: "You need to log in to update saved products."});
        } else {
            try {
                if (savedProduct) {
                    await removeFromSaved(product.id!);
                } else {
                    await addToSaved(product.id!);
                }
            } catch (error) {
                toast({variant: "destructive", description: "Error updating saved products."});
            }
        }
    };

    const addToCart = async () => {
        if (!loggedIn) {
            toast({description: "You need to log in to update your cart."});
        } else {
            try {
                await increaseOneInCart(product.id!);
                toast({description: "Item added to cart."});
            } catch (error) {
                if (error instanceof ApiError && error.error) {
                    const errorMap = new Map(
                        error.error.map(err => [err.reasonCode, true])
                    );

                    if (errorMap.get(ResultEntryReasonCodeEnum.NotEnoughProductInStock)) {
                        toast({description: "Not enough products in stock."});
                    }
                } else {
                    toast({variant: "destructive", description: "Error updating cart."});
                }
            }
        }
    }

    return (
        <Card className="w-full relative space-y-4 overflow-hidden">
            <figure>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveToggle}
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
                <Button variant="ghost" className="w-full" onClick={() => addToCart()}>
                    <PlusIcon className="size-4 me-1"/> Add to Card
                </Button>
            </CardFooter>
        </Card>
    );

};

export default ProductCard;