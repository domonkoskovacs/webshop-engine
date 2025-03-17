import React, {useState} from "react";
import {OrderResponse} from "../../../shared/api";
import {Card, CardContent} from "../../ui/Card";
import {Button} from "../../ui/Button";
import {formatDate, isCancelable, isReturnable} from "../../../lib/order.utils";
import {Separator} from "../../ui/Separator";

interface OrderItemProps {
    order: OrderResponse;
}

const OrderItem: React.FC<OrderItemProps> = ({order}) => {
    const [showDetails, setShowDetails] = useState(false);
    const items = order.items || [];
    const firstProductImageUrl = items[0]?.thumbNailUrl;
    const secondProductImageUrl = items[1]?.thumbNailUrl;

    return (
        <Card key={order.id} className="w-full py-0 my-0">
            <CardContent className="flex flex-col justify-center items-center sm:flex-row sm:justify-between">
                <div className="flex flex-col sm:flex-row">
                    <div
                        className={`flex ${items.length === 1 ? "justify-center" : "justify-start"} w-44 h-24 items-center gap-3`}
                    >
                        {firstProductImageUrl && (
                            <img
                                src={firstProductImageUrl}
                                alt={items[0].productName || "No product name available"}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        )}
                        {items.length > 1 && secondProductImageUrl && (
                            <img
                                src={secondProductImageUrl}
                                alt={items[1].productName || "No product name available"}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        )}
                    </div>
                    <div className="sm:ml-4 flex flex-col justify-center">
                        <p>Status: <strong>{order.status}</strong></p>
                        <p>Order date: <strong>{formatDate(order.orderDate)}</strong></p>
                        <p className="text-lg font-semibold">Total: ${order.totalPrice!.toFixed(2)}</p>
                    </div>
                </div>
                <div className="text-left">
                    <h3 className="text-lg font-semibold">Contact info:</h3>
                    <p className="text-sm">Address: <strong>
                        {order.address?.street ?? "N/A"}
                        {order.address?.streetNumber ?? ""},
                        {order.address?.city ?? "N/A"},
                        {order.address?.zipCode ?? "N/A"},
                        {order.address?.country ?? "N/A"}
                    </strong></p>
                    <p className="text-sm">Email: <strong>{order.email}</strong></p>
                    <p className="text-sm">Phone: <strong>{order.phoneNumber}</strong></p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {isCancelable(order) && <Button>
                        Cancel Order
                    </Button>}
                    {isReturnable(order) && <Button>
                        Return Items
                    </Button>}
                    <Button variant="link" onClick={() => setShowDetails(!showDetails)}>
                        {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                </div>
            </CardContent>
            {showDetails && (
                <div className="px-4 pb-4 border-t pt-2">
                    {items.map((orderItem, index) => {
                        const count = orderItem.count || 1;
                        const productPrice = orderItem?.individualPrice || 0;
                        const totalProductPrice = productPrice * count;
                        return (
                            <div key={index} className="flex flex-row items-center gap-3 py-2">
                                {orderItem && (
                                    <img
                                        src={orderItem.thumbNailUrl}
                                        alt={orderItem.productName || "No product name available"}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                )}
                                <div>
                                    <p className="font-semibold">
                                        {orderItem.productName} (x{count})
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Price: ${productPrice.toFixed(2)} x {count} = ${totalProductPrice.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <Separator/>
                    <div className="mt-4">
                        <p>Order number: {order.orderNumber}</p>
                        <p className="text-sm">Shipping Cost: ${(order.shippingPrice ?? NaN).toFixed(2)}</p>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default OrderItem;
