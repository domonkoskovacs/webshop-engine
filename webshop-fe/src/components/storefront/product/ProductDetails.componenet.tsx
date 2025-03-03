import React, { useEffect, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { ProductResponse } from "../../../shared/api";
import { useProduct } from "../../../hooks/UseProduct";
import { Button } from "../../ui/Button";
import { Skeleton } from "../../ui/Skeleton";

const ProductDetails: React.FC = () => {
    const navigate = useNavigate();
    const { getById } = useProduct();
    const [product, setProduct] = useState<ProductResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const id = pathSegments[5] || null;

    useEffect(() => {
        if (!id) {
            return;
        }

        (async () => {
            try {
                const response = await getById(id);
                if (!response) {
                } else {
                    setProduct(response);
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, getById, navigate]);

    if (loading) {
        return <div className="flex flex-col w-full items-center space-y-3 h-80 justify-center">
            <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]"/>
                <Skeleton className="h-4 w-[200px]"/>
            </div>
        </div>;
    }

    if (!product) {
        return (
            <div className="text-center h-80 flex flex-col items-center justify-center gap-4">
                <h1 className="text-5xl font-bold text-red-600">404</h1>
                <p className="text-2xl">Product Not Found</p>
                <p className="text-2xl">The product you are looking for does not exist.</p>
                <Button onClick={() => navigate("/products")}>Go to Products</Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg">{product.description}</p>
            <p className="text-xl font-semibold">Price: ${product.price}</p>
            <img src={product.imageUrls![0]} alt={product.name} className="w-64 h-64 object-cover mt-4" />
        </div>
    );
};

export default ProductDetails;
