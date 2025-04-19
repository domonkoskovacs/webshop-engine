import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Elements} from '@stripe/react-stripe-js';
import {stripePromise} from "../../lib/stripe.utils";
import PageContainer from "../../components/shared/PageContainer.component";
import PaymentForm from "../../components/storefront/order/PaymentForm.componenet";
import {Button} from "../../components/ui/Button";
import {ArrowLeft} from "lucide-react";
import {OrderResponse} from "../../shared/api";
import {Separator} from "../../components/ui/Separator";
import {Card, CardContent, CardFooter} from "../../components/ui/Card";
import OrderItem from "../../components/storefront/order/OrderItem.component";
import {usePublicStore} from "../../hooks/store/usePublicStore";
import {useCreatePaymentIntent} from "../../hooks/order/useCreatePaymentIntent";
import {useUserOrders} from "../../hooks/order/useUserOrders";
import {AppPaths} from "../../routing/AppPaths";

const CheckoutPayment: React.FC = () => {
    const {data: store} = usePublicStore()
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const {orders, isLoading: loadingOrders} = useUserOrders();
    const [loadError, setLoadError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderResponse>();
    const {mutateAsync: createIntent, isPending} = useCreatePaymentIntent();

    useEffect(() => {
        if (loadingOrders || !orderId) {
            return;
        }
        if (!orderId) {
            setLoadError("Order ID not provided.");
            setLoading(false);
            return;
        }

        const foundOrder = orders.find(o => o.id === orderId);
        if (!foundOrder) {
            setLoadError("Order not found.");
        } else {
            setOrder(foundOrder);
            setLoadError(null);
        }

        createIntent(orderId)
            .then(res => {
                setClientSecret(res.clientSecret);
            })
            .catch(() => {
                setLoadError("Failed to create payment intent.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [orders, loadingOrders, orderId, createIntent]);

    if (loading) {
        return <PageContainer layout="centered">
            <div>Loading payment details...</div>
        </PageContainer>;
    }

    if (loadError || !clientSecret || !order) {
        return <PageContainer layout="centered">
            <div style={{color: 'red'}}>{loadError || "Unexpected error occurred."}</div>
        </PageContainer>;
    }

    return (
        <PageContainer layout="centered" className="min-h-screen">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(AppPaths.MY_ORDERS)}
                className="absolute top-2 left-2 cursor-pointer"
            >
                <ArrowLeft className="h-5 w-5"/>
            </Button>
            <div className="flex flex-col sm:flex-row h-full w-2/3  items-center justify-center gap-3 my-4">
                <Card className="w-full md:w-1/2">
                    <CardContent className="mb-0 pb-0 max-h-[80vh] overflow-auto scrollbar">
                        {order.items?.map((item, index) => (
                            <OrderItem item={item} key={index}/>
                        ))}
                    </CardContent>
                    <CardFooter className="flex flex-col items-start py-2">
                        <p className="text-sm">
                            Shipping: <span> ${(store?.shippingPrice ?? NaN).toFixed(2)}</span>
                        </p>
                        <p className="text-lg">
                            <strong>Total:</strong> <span> ${(order.totalPrice ?? NaN).toFixed(2)}</span>
                        </p>
                    </CardFooter>
                </Card>
                <div className="hidden sm:flex items-center h-96">
                    <Separator orientation="vertical" className="h-full"/>
                </div>
                <div className="w-full md:w-1/2">
                    <Elements stripe={stripePromise} options={{clientSecret}}>
                        <PaymentForm order={order}/>
                    </Elements>
                </div>
            </div>
        </PageContainer>
    );
};

export default CheckoutPayment;
