import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {OrderResponse} from "../shared/api";
import {userService} from "../services/UserService";
import {useAuth} from "../hooks/UseAuth";
import {orderService} from "../services/OrderService";
import {toast} from "../hooks/UseToast";

interface UserContextType {
    orders: OrderResponse[];
    cancelOrder: (id: string) => Promise<void>;
    returnOrder: (id: string) => Promise<void>;
    loadingOrders: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loadingOrders, setLoadingOrders] = useState(true);
    const {loggedIn} = useAuth()

    const fetchOrders = useCallback(async () => {
        try {
            if (loggedIn) {
                const data = await userService.getOrders();
                setOrders(data);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoadingOrders(false);
        }
    }, [loggedIn]);

    useEffect(() => {
        (async () => {
            await fetchOrders();
        })();
    }, [fetchOrders]);

    const placeOrder = async () => {
        try {
            const order = await orderService.create();
            //setCart([]);
            setOrders((prevOrders) => [...prevOrders, order]);
            return order;
        } catch (error) {
            throw error;
        }
    };

    const cancelOrder = async (id: string) => {
        try {
            const updatedOrder = await orderService.cancel(id);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === id ? updatedOrder : order
                )
            );
            toast({description: "Order cancelled successfully."});
        } catch (error) {
            throw error
        }
    }

    const returnOrder = async (id: string) => {
        try {
            const updatedOrder = await orderService.returnOrder(id);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === id ? updatedOrder : order
                )
            );
            toast({description: "Order return requested successfully."});
        } catch (error) {
            throw error
        }
    }

    return (
        <UserContext.Provider
            value={{
                orders,
                cancelOrder,
                returnOrder,
                loadingOrders,
            }}>
            {children}
        </UserContext.Provider>
    );
};
