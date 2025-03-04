import React, {createContext, ReactNode, useCallback, useEffect, useState} from "react";
import {UpdateUserRequest, UserResponse} from "../shared/api";
import {userService} from "../services/UserService";
import {useAuth} from "../hooks/UseAuth";

interface UserContextType {
    user: UserResponse | undefined
    changePassword: (id: string, password: string) => Promise<void>;
    updateUser: (updateUserRequest: UpdateUserRequest) => Promise<void>;
    deleteUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<UserResponse>();
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

    const changePassword = async (id: string, password: string) => {
        try {
            await userService.newPassword(id, password);
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
            setUser(undefined);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    return (
        <UserContext.Provider value={{user, changePassword, updateUser, deleteUser}}>
            {children}
        </UserContext.Provider>
    );
};
