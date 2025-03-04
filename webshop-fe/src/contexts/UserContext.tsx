import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {AddressRequest, UpdateUserRequest, UserResponse} from "../shared/api";
import {userService} from "../services/UserService";
import {useAuth} from "../hooks/UseAuth";

interface UserContextType {
    user: UserResponse
    changePassword: (password: string) => Promise<void>;
    updateUser: (updateUserRequest: UpdateUserRequest) => Promise<void>;
    deleteUser: () => Promise<void>;
    updateShippingAddress: (newShippingAddress: AddressRequest) => Promise<void>;
    updateBillingAddress: (newBillingAddress: AddressRequest) => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<UserResponse>({});
    const {loggedIn} = useAuth()

    const fetchUser = useCallback(async () => {
        try {
            if (loggedIn) {
                const data = await userService.getCurrent();
                setUser(data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, [loggedIn]);

    useEffect(() => {
        (async () => {
            await fetchUser();
        })();
    }, [fetchUser]);

    const changePassword = async (password: string) => {
        try {
            await userService.newPassword(user?.id ?? '', password);
        } catch (error) {
            throw error;
        }
    };

    const updateUser = async (updateUserRequest: UpdateUserRequest) => {
        try {
            const updatedUser = await userService.updateUser(updateUserRequest);
            if (updatedUser) {
                setUser(updatedUser);
            }
        } catch (error) {
            throw error;
        }
    };

    const deleteUser = async () => {
        try {
            await userService.deleteUser();
            setUser({});
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

    return (
        <UserContext.Provider value={{user, changePassword, updateUser, deleteUser, updateShippingAddress, updateBillingAddress}}>
            {children}
        </UserContext.Provider>
    );
};
