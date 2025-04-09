import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Elements} from '@stripe/react-stripe-js';
import {orderService} from "../../services/OrderService";
import {stripePromise} from "../../lib/stripe.utils";
import PageContainer from "../../components/shared/PageContainer.component";
import PaymentForm from "../../components/storefront/order/PaymentForm.componenet";
import {Button} from "../../components/ui/Button";
import {ArrowLeft} from "lucide-react";
import {useUser} from "../../hooks/UseUser";
import {OrderResponse} from "../../shared/api";
import {Separator} from "../../components/ui/Separator";
import {Card, CardContent, CardFooter} from "../../components/ui/Card";
import OrderItem from "../../components/storefront/order/OrderItem.component";
import {usePublicStore} from "../../hooks/store/usePublicStore";

const CheckoutPayment: React.FC = () => {
    const {data: store} = usePublicStore()
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const {orders, loadingOrders} = useUser();
    const [loadError, setLoadError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderResponse>();

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

        orderService.paymentIntent(orderId)
            .then(response => {
                if (response?.clientSecret) {
                    setClientSecret(response.clientSecret);
                } else {
                    setLoadError("Failed to retrieve payment details.");
                }
                setLoading(false);
            })
            .catch(() => {
                setLoadError("Failed to load payment details. Please try again.");
                setLoading(false);
            });
    }, [orders, loadingOrders, orderId]);

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
                onClick={() => navigate("/previous-orders")}
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
