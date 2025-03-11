import React from "react";
import {OrderResponse} from "../../../shared/api";
import {Card, CardContent} from "../../ui/Card";
import {Button} from "../../ui/Button";
import {formatDate, isCancelable, isReturnable} from "../../../lib/order.utils";

interface OrderItemProps {
    order: OrderResponse;
}

const OrderItem: React.FC<OrderItemProps> = ({order}) => {

    const products = order.products || [];
    const firstProduct = products[0]?.product;
    const secondProduct = products[1]?.product;

    return (
        <Card key={order.id} className="w-full py-0 my-0">
            <CardContent className="flex flex-row items-center justify-between">
                <div className="flex flex-row">
                    <div
                        className={`flex ${products.length === 1 ? "justify-center" : "justify-start"} w-44 h-24 items-center gap-3`}>
                        {firstProduct && (
                            <img
                                src={firstProduct.imageUrls?.[0]}
                                alt={firstProduct.name || "No product name available"}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        )}
                        {products.length > 1 && secondProduct && (
                            <img
                                src={secondProduct.imageUrls?.[0]}
                                alt={secondProduct.name || "No product name available"}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        )}
                    </div>
                    <div className="ml-4 flex flex-col justify-center">
                        <p>Status: <strong>{order.status}</strong></p>
                        <p>Order date: <strong>{formatDate(order.orderDate)}</strong></p>
                        <p className="text-lg font-semibold">Total: ${order.totalPrice!.toFixed(2)}</p>
                    </div>
                </div>
                <div className=" text-left">
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
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderItem;
