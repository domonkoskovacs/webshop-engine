import React, {useState} from "react";
import {OrderResponse, OrderResponseStatusEnum} from "../../../shared/api";
import {Card, CardContent} from "../../ui/Card";
import {Button} from "../../ui/Button";
import {formatDate, getOrderActions} from "../../../lib/order.utils";
import {Separator} from "../../ui/Separator";
import {Link} from "react-router-dom";
import {generateProductUrl} from "../../../lib/url.utils";
import {useGender} from "../../../hooks/useGender";

interface OrderItemProps {
    order: OrderResponse;
}

const OrderItem: React.FC<OrderItemProps> = ({order}) => {
    const {gender} = useGender()
    const [showDetails, setShowDetails] = useState(false);
    const items = order.items || [];
    const firstItem = items[0];
    const secondItem = items[1];
    const actions = getOrderActions(order);

    const getProductGender = (itemGender?: string): string => {
        if (!itemGender) return "";
        return itemGender.toLowerCase() === "unisex"
            ? gender.toLowerCase()
            : itemGender.toLowerCase();
    };

    return (
        <Card className="w-full py-0 my-0">
            <CardContent className="flex flex-col justify-center items-center sm:flex-row sm:justify-between">
                <div className="flex flex-col sm:flex-row">
                    <div
                        className={`flex ${items.length === 1 ? "justify-center" : "justify-start"} w-44 h-24 items-center gap-3`}>
                        {firstItem?.thumbNailUrl && (
                            <Link
                                to={generateProductUrl(getProductGender(firstItem.gender), firstItem.categoryName, firstItem.subcategoryName, firstItem.productName, firstItem.productId)}>
                                <img
                                    src={firstItem.thumbNailUrl}
                                    alt={firstItem.productName || "No product name available"}
                                    className="w-20 h-20 object-cover rounded-md hover:opacity-80 transition"
                                />
                            </Link>
                        )}
                        {items.length > 1 && secondItem?.thumbNailUrl && (
                            <Link
                                to={generateProductUrl(getProductGender(secondItem.gender), secondItem.categoryName, secondItem.subcategoryName, secondItem.productName, secondItem.productId)}>
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
                    {order.status === OrderResponseStatusEnum.Created && (
                        <>
                            {actions.canPay && <Button className="w-full">Pay Order</Button>}
                            {actions.canCancel && <Button>Cancel Order</Button>}
                        </>
                    )}
                    {actions.canReturn && <Button>Return Items</Button>}
                    <Button variant="link" onClick={() => setShowDetails(!showDetails)}>
                        {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                </div>
            </CardContent>
            {showDetails && (
                <div className="px-4 pb-4 border-t pt-2">
                    {items.map((orderItem, index) => {
                        const count = orderItem.count || 1;
                        const productPrice = orderItem.individualPrice || 0;
                        const totalProductPrice = productPrice * count;
                        return (
                            <div key={index} className="flex flex-row items-center gap-3 py-2">
                                <div className="w-16 h-16">
                                    {orderItem.thumbNailUrl && (
                                        <Link
                                            to={generateProductUrl(getProductGender(orderItem.gender), orderItem.categoryName, orderItem.subcategoryName, orderItem.productName, orderItem.productId)}>
                                            <img
                                                src={orderItem.thumbNailUrl}
                                                alt={orderItem.productName || "No product name available"}
                                                className="w-16 h-16 object-cover rounded-md hover:opacity-80 transition"
                                            />
                                        </Link>
                                    )}
                                </div>
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
                    <div className="mt-4 text-sm">
                        <p>Order number: {order.orderNumber}</p>
                        <p className="text-sm">
                            Shipping Cost: ${order.shippingPrice?.toFixed(2)}
                        </p>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default OrderItem;
