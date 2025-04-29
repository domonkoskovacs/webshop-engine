import React, {useState} from "react";
import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {useNavigate} from "react-router-dom";
import {toast} from "@/hooks/useToast.ts";
import {Button} from "../../ui/button";
import {OrderResponse} from "@/shared/api";
import {AppPaths} from "@/routing/AppPaths.ts";

interface PaymentFormProps {
    order: OrderResponse;
}

const PaymentForm: React.FC<PaymentFormProps> = ({order}) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setProcessing(true);

        const {error: stripeError, paymentIntent} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                payment_method_data: {
                    billing_details: {
                        address: {
                            line1: `${order.billingAddress?.street || ""} ${order.billingAddress?.streetNumber || ""}`.trim(),
                            city: order.billingAddress?.city || "",
                            postal_code: order.billingAddress?.zipCode ? order.billingAddress.zipCode.toString() : "",
                            country: order.billingAddress?.country || "",
                        },
                    },
                },
            },
            redirect: "if_required",
        });

        if (stripeError) {
            setError(stripeError.message || "Payment failed.");
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            toast.success("Payment successful");
            navigate(AppPaths.MY_ORDERS);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement className="p-4 border border-gray-300 rounded"/>
            {error && <div className="text-red-500 mt-2">{error}</div>}
            <Button className="w-full mt-4" type="submit" disabled={!stripe || processing}>
                {processing ? "Processing..." : "Pay Now"}
            </Button>
        </form>
    );
};

export default PaymentForm;
