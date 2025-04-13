import React, {useState} from "react";
import {OrderResponse} from "../../../shared/api";
import {Card, CardContent} from "../../ui/Card";
import {Button} from "../../ui/Button";
import {formatDate, getOrderActions} from "../../../lib/order.utils";
import {Separator} from "../../ui/Separator";
import {Link, useNavigate} from "react-router-dom";
import {generateProductUrl} from "../../../lib/url.utils";
import {useGender} from "../../../hooks/useGender";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../../ui/AlertDialog";
import {getProductGender} from "../../../lib/product.utils";
import OrderItem from "./OrderItem.component";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../ui/Dialog";
import {useCancelOrder} from "../../../hooks/order/useCancelOrder";
import {useReturnOrder} from "../../../hooks/order/useReturnOrder";
import {handleGenericApiError} from "../../../shared/ApiError";
import {toast} from "../../../hooks/useToast";

interface OrderItemProps {
    order: OrderResponse;
}

const Order: React.FC<OrderItemProps> = ({order}) => {
    const {gender} = useGender()
    const [showDetails, setShowDetails] = useState(false);
    const items = order.items || [];
    const firstItem = items[0];
    const secondItem = items[1];
    const actions = getOrderActions(order);
    const navigate = useNavigate();
    const {mutateAsync: returnOrder} = useReturnOrder();
    const {mutateAsync: cancelOrder} = useCancelOrder();
    const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);

    return (
        <Card className="w-full py-0 my-0">
            <CardContent className="flex flex-col justify-center items-center sm:flex-row sm:justify-between">
                <div className="flex flex-col sm:flex-row">
                    <div
                        className={`flex ${items.length === 1 ? "justify-center" : "justify-start"} w-44 h-24 items-center gap-3`}>
                        {firstItem?.thumbNailUrl && (
                            <Link
                                to={generateProductUrl(getProductGender(firstItem.gender!, gender), firstItem.categoryName, firstItem.subcategoryName, firstItem.productName, firstItem.productId)}>
                                <img
                                    src={firstItem.thumbNailUrl}
                                    alt={firstItem.productName || "No product name available"}
                                    className="w-20 h-20 object-cover rounded-md hover:opacity-80 transition"
                                />
                            </Link>
                        )}
                        {items.length > 1 && secondItem?.thumbNailUrl && (
                            <Link
                                to={generateProductUrl(getProductGender(secondItem.gender!, gender), secondItem.categoryName, secondItem.subcategoryName, secondItem.productName, secondItem.productId)}>
                                <img
                                    src={secondItem.thumbNailUrl}
                                    alt={secondItem.productName || "No product name available"}
                                    className="w-20 h-20 object-cover rounded-md hover:opacity-80 transition"
                                />
                            </Link>
                        )}
                    </div>
                    <div className="sm:ml-4 flex flex-col justify-center mt-4 sm:mt-0">
                        <p>
                            Status: <strong>{order.status}</strong>
                        </p>
                        <p>
                            Order date: <strong>{formatDate(order.orderDate)}</strong>
                        </p>
                        <p className="text-lg font-semibold">
                            Total: ${order.totalPrice?.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="text-left mt-4 sm:mt-0">
                    <h3 className="text-lg font-semibold">Contact info:</h3>
                    <p className="text-sm">
                        Address: <strong>
                        {order.address?.street ?? "N/A"} {order.address?.streetNumber ?? ""}, {order.address?.city ?? "N/A"}, {order.address?.zipCode ?? "N/A"}, {order.address?.country ?? "N/A"}
                    </strong>
                    </p>
                    <p className="text-sm">
                        Email: <strong>{order.email}</strong>
                    </p>
                    <p className="text-sm">
                        Phone: <strong>{order.phoneNumber}</strong>
                    </p>
                </div>
                <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
                    {actions.canPay && <Button className="w-full"
                                               onClick={() => navigate(`/checkout-payment?orderId=${order.id}`)}>Pay
                        Order</Button>}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            {actions.canCancel && <Button>Cancel Order</Button>}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction asChild
                                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    <Button
                                        variant="destructive"
                                        onClick={async () => {
                                            try {
                                                await cancelOrder(order.id ?? '');
                                                toast.success("Order cancelled successfully.");
                                            } catch (error) {
                                                toast.error(
                                                    "Order cancellation failed.",
                                                    "Something went wrong while cancelling your order. Please try again."
                                                );
                                            }
                                        }}
                                    >Finish Order Cancellation</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Dialog open={isReturnDialogOpen} onOpenChange={setIsReturnDialogOpen}>
                        <DialogTrigger asChild>
                            {actions.canReturn && <Button>Return Items</Button>}
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                    If you request a return, one of our colleagues will contact you shortly with the
                                    return shipping details.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    onClick={async () => {
                                        try {
                                            await returnOrder(order.id ?? '');
                                            toast.success("Order return requested successfully.");
                                            setIsReturnDialogOpen(false);
                                        } catch (error) {
                                            handleGenericApiError(error)
                                        }
                                    }}
                                >
                                    Request Return
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant="link" onClick={() => setShowDetails(!showDetails)}>
                        {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                </div>
            </CardContent>
            {
                showDetails && (
                    <div className="px-4 pb-4 border-t pt-2">
                        {items.map((orderItem, index) =>
                            <OrderItem item={orderItem} key={index}/>
                        )}
                        <Separator/>
                        <div className="mt-4 text-sm">
                            <p>Order number: {order.orderNumber}</p>
                            <p className="text-sm">
                                Shipping Cost: ${order.shippingPrice?.toFixed(2)}
                            </p>
                        </div>
                    </div>
                )
            }
        </Card>
    )
        ;
};

export default Order;
