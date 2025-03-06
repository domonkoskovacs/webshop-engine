import React from 'react';
import {useAuth} from "../../hooks/UseAuth";
import EmptyState from "../../components/storefront/shared/EmptyPage.component";
import {useUser} from "../../hooks/UseUser";
import PublicEmptyPage from "../../components/storefront/shared/PublicEmptyPage.component";
import CartItem from "../../components/storefront/cart/CartItem.component";
import {Button} from "../../components/ui/Button";
import {Card, CardContent, CardFooter, CardHeader} from "../../components/ui/Card";
import {Separator} from "../../components/ui/Separator";

const SHIPPING_COST = 5.99;

const Cart: React.FC = () => {
    const {loggedIn} = useAuth()
    const {cart} = useUser()

    const fullPrice = cart.reduce((total, item) => total + item.count! * item.product!.price!, 0);
    const discountedPrice = cart.reduce((total, item) => {
        const price = item.product!.discountPercentage
            ? item.product!.price! * (1 - item.product!.discountPercentage / 100)
            : item.product!.price!;
        return total + item.count! * price;
    }, 0);

    const discountAmount = fullPrice - discountedPrice;
    const finalPrice = discountedPrice + SHIPPING_COST;

    return cart.length > 0 ? (
        <main className="w-full mx-10 mb-6 relative">
            <h1 className="text-2xl font-bold my-6">Your Cart</h1>
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6 ">
                <Card className="md:col-span-2 self-start space-y-4">
                    <CardContent>
                        {cart.map((item) => (
                            <CartItem key={item.product!.id} item={item} type="page"/>
                        ))}
                    </CardContent>
                </Card>
                <div className="relative">

                    <Card className="sticky top-4 self-start">
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Order Summary</h2>
                        </CardHeader>
                        <Separator/>
                        <CardContent className="flex flex-col w-full gap-3">
                            <p className="text-lg">
                                Full Price:
                                {discountAmount > 0 ? (
                                    <span className="line-through text-gray-500"> ${fullPrice.toFixed(2)}</span>
                                ) : (
                                    <span> ${fullPrice.toFixed(2)}</span>
                                )}
                            </p>

                            {discountAmount > 0 && (
                                <p className="text-red-500">Discount: -${discountAmount.toFixed(2)}</p>
                            )}

                            <p className="text-lg font-bold">Subtotal: ${discountedPrice.toFixed(2)}</p>
                            <p className="text-lg">Shipping: ${SHIPPING_COST.toFixed(2)}</p>
                            <Separator className="w-full"/>
                            <p className="text-xl font-bold">Total: ${finalPrice.toFixed(2)}</p>
                        </CardContent>
                        <CardFooter className="p-0 border-t">
                            <Button className="w-full rounded-t-none">Go to Checkout</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    ) : (
        <div className="flex flex-col space-y-3 py-20">
            {loggedIn ? (
                <EmptyState title="You don't have any products in your cart!"/>
            ) : (
                <PublicEmptyPage emptyStateTitle="You don't have any products in your cart!"
                                 buttonTitle="You need to log in to put products in your cart!"/>
            )}
        </div>
    );
};

export default Cart;
