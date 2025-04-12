import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {
    AddressRequest,
    OrderResponse,
    ProductResponse,
    UpdateUserRequest,
    UpdateUserRequestGenderEnum,
    UserResponse
} from "../shared/api";
import {userService} from "../services/UserService";
import {useAuth} from "../hooks/UseAuth";
import {orderService} from "../services/OrderService";
import {toast} from "../hooks/UseToast";

interface UserContextType {
    user: UserResponse
    saved: ProductResponse[];
    orders: OrderResponse[];
    changePassword: (password: string) => Promise<void>;
    updateUserUserInfo: (email: string, firstname: string, lastname: string, phoneNUmber: string, gender: UpdateUserRequestGenderEnum, subscribedToEmail: boolean) => Promise<void>;
    deleteUser: () => Promise<void>;
    updateShippingAddress: (newShippingAddress: AddressRequest) => Promise<void>;
    updateBillingAddress: (newBillingAddress: AddressRequest) => Promise<void>;
    addToSaved: (id: string) => Promise<void>;
    removeFromSaved: (id: string) => Promise<void>;
    isSaved: (id: string) => boolean;
    placeOrder: () => Promise<OrderResponse>;
    cancelOrder: (id: string) => Promise<void>;
    returnOrder: (id: string) => Promise<void>;
    toggleSaved: (id: string) => Promise<void>;
    loadingOrders: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<UserResponse>({});
    const [saved, setSaved] = useState<ProductResponse[]>([])
    const [orders, setOrders] = useState<OrderResponse[]>([])
    const [loadingOrders, setLoadingOrders] = useState(true);
    const {loggedIn, logout} = useAuth()

    const fetchUser = useCallback(async () => {
        try {
            if (loggedIn) {
                const data = await userService.getCurrent();
                setUser(data);
            } else {
                setUser({});
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    }, [loggedIn]);

    const fetchSaved = useCallback(async () => {
        try {
            if (loggedIn && user) {
                const data = await userService.getSaved();
                setSaved(data);
            } else {
                setSaved([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, [loggedIn, user]);

    const fetchOrders = useCallback(async () => {
        try {
            if (loggedIn && user) {
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
    }, [loggedIn, user]);

    useEffect(() => {
        (async () => {
            await fetchUser();
        })();
    }, [fetchUser]);

    useEffect(() => {
        (async () => {
            await fetchSaved();
        })();
    }, [fetchSaved]);

    useEffect(() => {
        (async () => {
            await fetchOrders();
        })();
    }, [fetchOrders]);

    const changePassword = async (password: string) => {
        try {
            await userService.newPassword(user?.id ?? '', password);
        } catch (error) {
            throw error;
        }
    };

    const deleteUser = async () => {
        try {
            await userService.deleteUser();
            setUser({});
            logout()
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const updateShippingAddress = async (newShippingAddress: AddressRequest) => {
        try {
            if (user) {
                const updateUserRequest: UpdateUserRequest = {
                    email: user.email,
                    firstname: user.firstname ?? '',
                    lastname: user.lastname ?? '',
                    phoneNumber: user.phoneNumber ?? '',
                    gender: user.gender,
                    subscribedToEmail: user.subscribedToEmail,
                    shippingAddress: newShippingAddress,
                    billingAddress: user.billingAddress ? {
                        city: user.billingAddress.city!,
                        country: user?.billingAddress.country!,
                        zipCode: user?.billingAddress.zipCode!,
                        street: user?.billingAddress.street!,
                        streetNumber: user?.billingAddress.streetNumber!,
                        floorNumber: user?.billingAddress.floorNumber!,
                    } : undefined,
                };
                const updatedUser = await userService.updateUser(updateUserRequest);
                if (updatedUser) {
                    setUser(updatedUser)
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const updateBillingAddress = async (newBillingAddress: AddressRequest) => {
        try {
            if (user) {
                const updateUserRequest: UpdateUserRequest = {
                    email: user.email,
                    firstname: user.firstname ?? '',
                    lastname: user.lastname ?? '',
                    phoneNumber: user.phoneNumber ?? '',
                    gender: user.gender,
                    subscribedToEmail: user.subscribedToEmail,
                    billingAddress: newBillingAddress,
                    shippingAddress: user.shippingAddress ? {
                        city: user.shippingAddress.city!,
                        country: user?.shippingAddress.country!,
                        zipCode: user?.shippingAddress.zipCode!,
                        street: user?.shippingAddress.street!,
                        streetNumber: user?.shippingAddress.streetNumber!,
                        floorNumber: user?.shippingAddress.floorNumber!,
                    } : undefined,
                };
                const updatedUser = await userService.updateUser(updateUserRequest);
                if (updatedUser) {
                    setUser(updatedUser)
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const updateUserUserInfo = async (email: string, firstname: string, lastname: string, phoneNumber: string, gender: UpdateUserRequestGenderEnum, subscribedToEmail: boolean) => {
        try {
            if (user) {
                const updateUserRequest: UpdateUserRequest = {
                    email: email,
                    firstname: firstname,
                    lastname: lastname,
                    phoneNumber: phoneNumber,
                    gender: gender,
                    subscribedToEmail: subscribedToEmail,
                    billingAddress: user.billingAddress ? {
                        city: user.billingAddress.city!,
                        country: user.billingAddress.country!,
                        zipCode: user.billingAddress.zipCode!,
                        street: user.billingAddress.street!,
                        streetNumber: user.billingAddress.streetNumber!,
                        floorNumber: user.billingAddress.floorNumber!,
                    } : undefined,
                    shippingAddress: user.shippingAddress ? {
                        city: user.shippingAddress.city!,
                        country: user.shippingAddress.country!,
                        zipCode: user.shippingAddress.zipCode!,
                        street: user.shippingAddress.street!,
                        streetNumber: user.shippingAddress.streetNumber!,
                        floorNumber: user.shippingAddress.floorNumber!,
                    } : undefined,
                };
                const updatedUser = await userService.updateUser(updateUserRequest);
                if (updatedUser) {
                    setUser(updatedUser)
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const addToSaved = async (id: string) => {
        try {
            await userService.addSaved([id]);
            setUser((prevUser) => {
                if (!prevUser) return prevUser;
                const updatedSaved = saved ? [...saved] : [];
                if (!updatedSaved.some((item) => item.id === id)) {
                    const product = {id};
                    updatedSaved.push(product);
                }
                return {...prevUser, saved: updatedSaved};
            });
        } catch (error) {
            throw error
        }
    };

    const removeFromSaved = async (id: string) => {
        try {
            await userService.removeSaved([id]);
            setUser((prevUser) => {
                if (!prevUser) return prevUser;
                return {
                    ...prevUser,
                    saved: saved?.filter((item) => item.id !== id) || [],
                };
            });
        } catch (error) {
            throw error
        }
    };

    const isSaved = (id: string): boolean => {
        return !!saved?.some((item) => item.id === id);
    };

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

    const toggleSaved = async (id: string) => {
        if (!loggedIn) {
            toast({description: "You need to log in to update saved products."});
            return;
        }
        try {
            if (isSaved(id)) {
                await removeFromSaved(id);
            } else {
                await addToSaved(id);
            }
        } catch (error) {
            toast({variant: "destructive", description: "Error updating saved products."});
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                saved,
                orders,
                changePassword,
                updateUserUserInfo,
                deleteUser,
                updateShippingAddress,
                updateBillingAddress,
                addToSaved,
                removeFromSaved,
                isSaved,
                placeOrder,
                cancelOrder,
                returnOrder,
                toggleSaved,
                loadingOrders,
            }}>
            {children}
        </UserContext.Provider>
    );
};
