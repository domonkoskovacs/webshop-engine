import React from 'react';
import {useUser} from "../../hooks/UseUser";
import {Card, CardContent, CardFooter, CardHeader} from "../../components/ui/Card";
import CartItem from "../../components/storefront/cart/CartItem.component";
import {Separator} from "../../components/ui/Separator";
import {useAuth} from "../../hooks/UseAuth";
import {calculateCartTotals} from "../../lib/price.utils";
import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";

const Checkout: React.FC = () => {
    const {user, cart} = useUser()
    const {loggedIn} = useAuth()

    const {fullPrice, discountedPrice, discountAmount, finalPrice, shippingCost} = calculateCartTotals(cart);
    const shippingAddress = user.shippingAddress!
    const billingAddress = user.billingAddress!

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: { preventDefault: () => void; }) => {

    };

    return (
        <main className="w-full mx-10 mb-6 relative">
            <h1 className="text-2xl font-bold my-6">Checkout</h1>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 ">
                <Card className="self-start">
                    <CardContent className="mb-0 pb-0">
                        {cart.map((item) => (
                            <CartItem key={item.product!.id} item={item} type="page"/>
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
                <div className="flex flex-col gap-4">
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Account Information</h2>
                        </CardHeader>
                        <Separator/>
                        <CardContent className="flex flex-col w-full gap-3">
                            <div className="mt-4">
                                <p>Name: {user.firstname} {user.lastname}</p>
                                <p>Email: {user.email}</p>
                                <p>Phone: {user.phoneNumber ?? "N/A"}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Shipping Address</h2>
                        </CardHeader>
                        <Separator/>
                        <CardContent className="flex flex-col w-full gap-3">
                            <div className="mt-4">
                                <p>
                                    {shippingAddress?.street ?? "N/A"} {shippingAddress?.streetNumber ?? ""},
                                    {shippingAddress?.city ?? "N/A"}, {shippingAddress?.zipCode ?? "N/A"},
                                    {shippingAddress?.country ?? "N/A"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Billing Address</h2>
                        </CardHeader>
                        <Separator/>
                        <CardContent className="flex flex-col w-full gap-3">
                            <div className="mt-4">
                                <p>
                                    {billingAddress?.street ?? "N/A"} {billingAddress?.streetNumber ?? ""},
                                    {billingAddress?.city ?? "N/A"}, {billingAddress?.zipCode ?? "N/A"},
                                    {billingAddress?.country ?? "N/A"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Shipping Option</h2>
                        </CardHeader>
                        <Separator/>
                        <CardContent className="flex flex-col w-full gap-3">
                            <div className="mt-4">
                                <p>Standard Shipping - ${shippingCost.toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h2 className="text-xl font-semibold">Order Summary</h2>
                        </CardHeader>
                        <Separator/>
                        <CardContent className="flex flex-col w-full gap-3">
                            <p className="text-xl font-bold">Total: ${finalPrice.toFixed(2)}</p>
                        </CardContent>
                    </Card>
                    <div>
                        <form onSubmit={handleSubmit}>
                            {/*<PaymentElement/>*/}
                            <button disabled={!stripe}></button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
