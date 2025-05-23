import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardFooter, CardHeader} from "../../components/ui/card.tsx";
import CartItem from "../../components/storefront/cart/CartItem.component";
import {Separator} from "../../components/ui/separator.tsx";
import {calculateCartTotals} from "@/lib/price.utils.ts";
import {Button} from "../../components/ui/button.tsx";
import {toast, unexpectedErrorToast} from "@/hooks/useToast.ts";
import {useNavigate} from "react-router-dom";
import PageContainer from '@/components/shared/PageContainer.component';
import PageHeader from "../../components/shared/PageHeader";
import PageTitle from "../../components/shared/PageTitle";
import PageContent from "../../components/shared/PageContent";
import {usePublicStore} from "@/hooks/store/usePublicStore.ts";
import {useCart} from "@/hooks/user/useCart.ts";
import {useUser} from "@/hooks/user/useUser.ts";
import {useCreateOrder} from "@/hooks/order/useCreateOrder.ts";
import {AppPaths} from "@/routing/AppPaths.ts";

const Checkout: React.FC = () => {
    const {cart} = useCart();
    const {mutateAsync: placeOrder} = useCreateOrder()
    const {data: user} = useUser()
    const {data: store} = usePublicStore()
    const navigate = useNavigate();

    const {
        fullPrice,
        discountedPrice,
        discountAmount,
        finalPrice
    } = calculateCartTotals(cart, store?.shippingPrice ?? NaN);
    const shippingAddress = user?.shippingAddress
    const billingAddress = user?.billingAddress

    const [errors, setErrors] = useState<string[]>([]);
    const [addressError, setAddressError] = useState(false);

    useEffect(() => {
        const newErrors: string[] = [];

        if (!shippingAddress || !billingAddress) {
            newErrors.push("You need to set both shipping and billing addresses to place the order.");
            setAddressError(true);
        } else {
            setAddressError(false);
        }

        if (store?.minOrderPrice && discountedPrice < store.minOrderPrice) {
            newErrors.push(`Order price too low. Minimum order price is $${store.minOrderPrice.toFixed(2)}.`);
        }

        setErrors(newErrors);
    }, [shippingAddress, billingAddress, discountedPrice, store?.minOrderPrice]);


    const handleOrderPlacement = async () => {
        try {
            const order = await placeOrder();
            navigate(`/checkout-payment?orderId=${order.id}`);
            toast.success("Order placed successfully",);
        } catch (error) {
            unexpectedErrorToast(error, "Can't place order. Please try again.");
        }
    }

    return (
        <PageContainer layout="spacious" className="relative">
            <PageHeader>
                <PageTitle>Checkout</PageTitle>
            </PageHeader>
            <PageContent className="flex flex-col md:grid md:grid-cols-2 gap-6 ">
                <Card className="self-start w-full">
                    <CardContent className="mb-0 pb-0">
                        {cart.map((item) => (
                            <CartItem key={item.product!.id} item={item} type="page" amountModifiable={false}/>
                        ))}
                    </CardContent>
                    <CardFooter className="flex flex-col items-start py-2">
                        <p>
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

                        <p className="font-bold">Subtotal: ${discountedPrice.toFixed(2)}</p>
                    </CardFooter>
                </Card>
                <div className="relative">
                    <Card className="sticky top-4 self-start">
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Order Details</h2>
                        </CardHeader>
                        <Separator/>
                        <CardContent className="flex flex-col w-full gap-4">
                            <div>
                                <h3 className="text-lg font-semibold">Account Information</h3>
                                <p>Name: {user?.firstname} {user?.lastname}</p>
                                <p>Email: {user?.email}</p>
                                <p>Phone: {user?.phoneNumber ?? "N/A"}</p>
                            </div>
                            <Separator/>
                            <div>
                                <h3 className="text-lg font-semibold">Shipping Address</h3>
                                <p>
                                    {shippingAddress?.street ?? "N/A"} {shippingAddress?.streetNumber ?? ""},
                                    {shippingAddress?.city ?? "N/A"}, {shippingAddress?.zipCode ?? "N/A"},
                                    {shippingAddress?.country ?? "N/A"}
                                </p>
                            </div>
                            <Separator/>
                            <div>
                                <h3 className="text-lg font-semibold">Billing Address</h3>
                                <p>
                                    {billingAddress?.street ?? "N/A"} {billingAddress?.streetNumber ?? ""},
                                    {billingAddress?.city ?? "N/A"}, {billingAddress?.zipCode ?? "N/A"},
                                    {billingAddress?.country ?? "N/A"}
                                </p>
                            </div>
                            <Separator/>
                            <div>
                                <h3 className="text-lg font-semibold">Shipping Option</h3>
                                <p>Standard Shipping - ${(store?.shippingPrice ?? NaN).toFixed(2)}</p>
                            </div>
                            <Separator/>
                            <div className="my-6">
                                <h3 className="text-lg font-semibold">Order Summary</h3>
                                <p className="text-xl font-bold">Total: ${finalPrice.toFixed(2)}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="p-0 border-t flex flex-col">
                            {errors.length > 0 && (
                                <div className="text-red-500 my-4">
                                    {errors.map((err, idx) => (
                                        <div key={idx} className="text-red-500 px-4 py-2">
                                            {err}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {addressError ? (
                                    <Button className="w-full rounded-t-none" onClick={() => navigate(AppPaths.PROFILE)}>Go
                                        to
                                        Profile</Button>
                                ) :
                                <Button
                                    className="w-full rounded-t-none"
                                    onClick={handleOrderPlacement}
                                    disabled={errors.length > 0}
                                >
                                    Place Order
                                </Button>}
                        </CardFooter>
                    </Card>
                </div>
            </PageContent>
        </PageContainer>
    );
};

export default Checkout;
