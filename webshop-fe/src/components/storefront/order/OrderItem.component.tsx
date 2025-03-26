import React from "react";
import {Link} from "react-router-dom";
import {OrderItemResponse} from "../../../shared/api";
import {generateProductUrl} from "../../../lib/url.utils";
import {getProductGender} from "../../../lib/product.utils";
import {useGender} from "../../../hooks/useGender";

interface OrderItemCardProps {
    item: OrderItemResponse
}

const OrderItem: React.FC<OrderItemCardProps> = ({item}) => {
    const {gender} = useGender()
    const count = item.count || 1;
    const productPrice = item.individualPrice || 0;
    const totalProductPrice = count * productPrice;

    return (
        <div className="flex flex-row items-center gap-3 py-2 mr-40">
            <div className="w-16 h-16">
                {item.thumbNailUrl && (
                    <Link
                        to={generateProductUrl(
                            getProductGender(item.gender!, gender),
                            item.categoryName,
                            item.subcategoryName,
                            item.productName ?? "product",
                            item.productId
                        )}
                    >
                        <img
                            src={item.thumbNailUrl}
                            alt={item.productName || "No product name available"}
                            className="w-16 h-16 object-cover rounded-md hover:opacity-80 transition"
                        />
                    </Link>
                )}
            </div>
            <div>
                <p className="font-semibold">{item.productName} (x{count})</p>
                <p className="text-sm text-gray-600">
                    Price: ${productPrice.toFixed(2)} x {count} = ${totalProductPrice.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default OrderItem;
