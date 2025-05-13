import React from 'react';
import {useAuth} from "@/hooks/useAuth.ts";
import EmptyState from "../../components/storefront/shared/EmptyPage.component";
import PublicEmptyPage from "../../components/storefront/shared/PublicEmptyPage.component";
import CartItem from "../../components/storefront/cart/CartItem.component";
import {Button} from "../../components/ui/button.tsx";
import {Card, CardContent, CardFooter, CardHeader} from "../../components/ui/card.tsx";
import {Separator} from "../../components/ui/separator.tsx";
import {calculateCartTotals} from "@/lib/price.utils.ts";
import {Link} from "react-router-dom";
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageTitle from "../../components/shared/PageTitle";
import PageContent from "../../components/shared/PageContent";
import {usePublicStore} from "@/hooks/store/usePublicStore.ts";
import {useCart} from "@/hooks/user/useCart.ts";
import {AppPaths} from "@/routing/AppPaths.ts";

const Cart: React.FC = () => {
    const {loggedIn} = useAuth()
    const {cart} = useCart();
    const {data: store} = usePublicStore()

    const {
        fullPrice,
        discountedPrice,
        discountAmount,
        finalPrice
    } = calculateCartTotals(cart, store?.shippingPrice ?? NaN);

    return cart.length > 0 ? (
        <PageContainer layout="spacious" className="relative">
            <PageHeader>
                <PageTitle>Your Cart</PageTitle>
            </PageHeader>
            <PageContent className="flex flex-col md:grid md:grid-cols-3 gap-6 ">
                <Card className="w-full md:col-span-2 self-start space-y-4">
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
                            <p className="text-lg">Shipping: ${(store?.shippingPrice ?? NaN).toFixed(2)}</p>
                            <Separator className="w-full"/>
                            <p className="text-xl font-bold">Total: ${finalPrice.toFixed(2)}</p>
                        </CardContent>
                        <CardFooter className="p-0 border-t">
                            <Link className="w-full rounded-t-none" to={AppPaths.CHECKOUT}>
                                <Button className="w-full rounded-t-none">Go to Checkout</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </PageContent>
        </PageContainer>) : (
        <PageContainer layout="centered" className="space-y-3 py-20">
            {loggedIn ? (
                <EmptyState title="You don't have any products in your cart!"/>
            ) : (
                <PublicEmptyPage emptyStateTitle="You don't have any products in your cart!"
                                 buttonTitle="You need to log in to put products in your cart!"/>
            )}
        </PageContainer>
    );
};

export default Cart;
