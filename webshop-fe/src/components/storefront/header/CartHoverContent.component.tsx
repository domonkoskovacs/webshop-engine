import React from "react";
import {Button} from "../../ui/Button";
import {useAuth} from "../../../hooks/UseAuth";
import {useUser} from "../../../hooks/UseUser";
import {useNavigate} from "react-router-dom";

const CartHoverContent: React.FC = () => {
    const navigate = useNavigate();
    const {loggedIn} = useAuth()
    const {cart} = useUser()

    return <div className="flex flex-col content-center text-center space-y-2 gap-2">
        {loggedIn ?
            <>
                {cart.length > 0 ? (
                    <div className="space-y-2">
                        {cart.map((item) => (
                            <div key={item.product?.id} className="flex items-center gap-3 border-b pb-2">
                                <img
                                    src={item.product?.imageUrls![0]}
                                    alt={item.product?.name}
                                    className="w-12 h-12 object-cover rounded-md"
                                />
                                <div className="flex flex-col items-start text-left">
                                    <span className="font-medium">{item.product?.name}</span>
                                    <span className="text-sm text-gray-500">
                                            {item.count} * ${item.product?.price!.toFixed(2)}
                                        </span>
                                    <span className="font-semibold">
                                            ${(item.count! * item.product!.price!).toFixed(2)}
                                        </span>
                                </div>
                            </div>
                        ))}
                        <Button className="w-full mt-2">Checkout</Button>
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
