import React from 'react';
import {useUser} from "../../hooks/UseUser";
import {Card, CardContent, CardFooter, CardHeader} from "../../components/ui/Card";
import CartItem from "../../components/storefront/cart/CartItem.component";
import {Separator} from "../../components/ui/Separator";
import {calculateCartTotals} from "../../lib/price.utils";
import {Button} from "../../components/ui/Button";
import {toast} from "../../hooks/UseToast";
import {useNavigate} from "react-router-dom";

const Checkout: React.FC = () => {
    const {user, cart, placeOrder} = useUser()
    const navigate = useNavigate();

    const {fullPrice, discountedPrice, discountAmount, finalPrice, shippingCost} = calculateCartTotals(cart);
    const shippingAddress = user.shippingAddress!
    const billingAddress = user.billingAddress!

    const handleOrderPlacement = async () => {
        try {
            await placeOrder()
            navigate("/checkout-payment")
            toast({
                description: "Order placed successfully",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "Can't place order. Please try again.",
            });
        }
    }

    return (
        <main className="w-full mx-10 mb-6 relative">
            <h1 className="text-2xl font-bold my-6">Checkout</h1>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-6 ">
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
                                <p>Name: {user.firstname} {user.lastname}</p>
                                <p>Email: {user.email}</p>
                                <p>Phone: {user.phoneNumber ?? "N/A"}</p>
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
                                <p>Standard Shipping - ${shippingCost.toFixed(2)}</p>
                            </div>
                            <Separator/>
                            <div className="my-6">
                                <h3 className="text-lg font-semibold">Order Summary</h3>
                                <p className="text-xl font-bold">Total: ${finalPrice.toFixed(2)}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="p-0 border-t">
                            <Button className="w-full rounded-t-none" onClick={() => handleOrderPlacement()}>Place Order</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
