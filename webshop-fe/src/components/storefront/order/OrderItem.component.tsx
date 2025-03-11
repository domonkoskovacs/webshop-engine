import React from "react";
import {OrderResponse} from "../../../shared/api";
import {Card, CardContent} from "../../ui/Card";
import {Button} from "../../ui/Button";

interface OrderItemProps {
    order: OrderResponse;
}

const OrderItem: React.FC<OrderItemProps> = ({order}) => {
    const formatDate = (date: string | undefined) => {
        if (!date) return "-";
        const newDate = new Date(date);
        return newDate.toLocaleDateString();
    };

    const products = order.products || [];
    const firstProduct = products[0]?.product;
    const secondProduct = products[1]?.product;

    return (
        <Card key={order.id} className="w-full py-0 my-0">
            <CardContent className="flex flex-row items-center justify-between">
                <div className={`flex ${products.length === 1 ? "justify-center" : "justify-start"} w-44 h-24 items-center gap-3`}>
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
                <div className=" text-left">
                    <p className="text-sm text-gray-600">📅 Date: <strong>{formatDate(order.orderDate)}</strong></p>
                    <p className="text-sm text-gray-600">🏠
                        Address: <strong>
                            {order.address?.street ?? "N/A"}
                            {order.address?.streetNumber ?? ""},
                            {order.address?.city ?? "N/A"},
                            {order.address?.zipCode ?? "N/A"},
                            {order.address?.country ?? "N/A"}
                    </strong></p>
                    <p className="text-sm text-gray-600">📧 Email: <strong>{order.email}</strong></p>
                    <p className="text-sm text-gray-600">📞 Phone: <strong>{order.phoneNumber}</strong></p>
                    <p className="text-sm text-gray-600">🔹 Status: <strong>{order.status}</strong></p>
                </div>

                <div className="flex flex-col items-end">
                    <p className="text-lg font-semibold">💰 Total: ${order.totalPrice!.toFixed(2)}</p>
                    <div className="mt-2 flex gap-2">
                        <Button
                            className="bg-red-500 text-white px-4 py-1 rounded"
                        >
                            ❌ Cancel
                        </Button>
                        <Button
                            className="bg-blue-500 text-white px-4 py-1 rounded"
                        >
                            🔄 Send Back
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderItem;
