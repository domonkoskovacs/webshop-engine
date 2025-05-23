import React from "react";
import {Link} from "react-router-dom";
import {OrderItemResponse} from "@/shared/api";
import {generateProductUrl} from "@/lib/url.utils.ts";
import {getProductGender} from "@/lib/product.utils.ts";
import {useGender} from "@/hooks/useGender.ts";

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
            <div className="w-20 sm:w-16 aspect-square flex-shrink-0">
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
                            className="w-full h-full object-cover rounded-md hover:opacity-80 transition"
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
