import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { orderService } from "../../services/OrderService";
import { stripePromise } from "../../lib/stripe.utils";
import PageContainer from "../../components/storefront/shared/PageContainer.component";
import PaymentForm from "../../components/storefront/order/PaymentForm.componenet";
import { Button } from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import { useUser } from "../../hooks/UseUser";
import { OrderResponse } from "../../shared/api";

const CheckoutPayment: React.FC = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { orders } = useUser();
    const [loadError, setLoadError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderResponse | undefined>(undefined);

    useEffect(() => {
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
    }, [orderId, orders]);

    if (loading) {
        return <div>Loading payment details...</div>;
    }

    if (loadError || !clientSecret || !order) {
        return <div style={{ color: 'red' }}>{loadError || "Unexpected error occurred."}</div>;
    }

    return (
        <PageContainer layout="centered">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/previous-orders")}
                className="absolute top-10 left-10 cursor-pointer"
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm order={order} />
            </Elements>
        </PageContainer>
    );
};

export default CheckoutPayment;
