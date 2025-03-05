import React from "react";
import {Button} from "../../ui/Button";
import {useAuth} from "../../../hooks/UseAuth";
import {useUser} from "../../../hooks/UseUser";
import {useNavigate} from "react-router-dom";
import CartHoverItem from "../cart/CartHoverItem.component";

const CartHoverContent: React.FC = () => {
    const navigate = useNavigate();
    const {loggedIn} = useAuth()
    const {cart} = useUser()

    const totalPrice = cart.reduce((total, item) => {
        const price = item.product?.discountPercentage
            ? item.product.price! * (1 - item.product.discountPercentage / 100)
            : item.product!.price!;
        return total + (item.count! * price);
    }, 0);

    const sortedCart = [...cart].sort((a, b) => (a.product?.name || '').localeCompare(b.product?.name || ''));

    return <div className="flex flex-col content-center text-center space-y-2 gap-2">
        {loggedIn ?
            <>
                {cart.length > 0 ? (
                    <div className="space-y-2">
                        <div className="h-[50vh] overflow-auto scrollbar">
                            {sortedCart.map((item) => (
                                <CartHoverItem item={item}/>
                            ))}
                        </div>
                        <div className="flex flex-row justify-between items-center">
                            <h1 className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</h1>
                            <Button className="w-1/3 mt-2" onClick={() => navigate("/checkout")}>Checkout</Button>
                        </div>
                    </div>
                ) : (
                    <p>Your cart is empty!</p>
                )}
            </> :
            <>
                Log in to use the cart!
                <Button onClick={() => {
                    navigate("/authentication?type=login")
                }}>
                    Login
                </Button>
                <Button onClick={() => {
                    navigate("/authentication?type=registration")
                }}>
                    Register
                </Button>
                <h1>Join us today!</h1>
            </>
        }
    </div>
};

export default CartHoverContent;
