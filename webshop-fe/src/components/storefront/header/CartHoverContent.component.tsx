import React from "react";
import {Button} from "../../ui/Button";
import {useUser} from "../../../hooks/UseUser";
import {useNavigate} from "react-router-dom";
import CartItem from "../cart/CartItem.component";
import {calculateCartTotals} from "../../../lib/price.utils";
import {usePublicStore} from "../../../hooks/store/usePublicStore";

const CartHoverContent: React.FC = () => {
    const navigate = useNavigate();
    const {data: store} = usePublicStore()
    const {cart} = useUser()

    const {discountedPrice} = calculateCartTotals(cart, store?.shippingPrice ?? NaN);
    const sortedCart = [...cart].sort((a, b) => (a.product?.name || '').localeCompare(b.product?.name || ''));

    return <div className="flex flex-col content-center text-center space-y-2 gap-2">
        {cart.length > 0 ? (
            <div className="space-y-2">
                <div className="h-[50vh] overflow-auto scrollbar">
                    {sortedCart.map((item) => (
                        <CartItem key={item.product!.id} item={item}/>
                    ))}
                </div>
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-xl font-bold">Subtotal: ${discountedPrice.toFixed(2)}</h1>
                    <Button className="w-1/3 mt-2" onClick={() => navigate("/checkout")}>Checkout</Button>
                </div>
            </div>
        ) : (
            <p>Your cart is empty!</p>
        )}
    </div>
};

export default CartHoverContent;
