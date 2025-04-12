import {useUser} from "./useUser";
import {AddressRequest, UpdateUserRequest, UpdateUserRequestGenderEnum, UserResponse,} from "../../shared/api";
import {toAddressRequest} from "../../lib/address.utils";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useUserGuard} from "../useUserGuard";
import {userService} from "../../services/UserService";
import {ApiError} from "../../shared/ApiError";

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const {assertUser} = useUserGuard();
    const {data: user} = useUser();

    const {mutateAsync: updateUserMutation, isPending} = useMutation<UserResponse, ApiError, UpdateUserRequest>({
        mutationFn: async (updateUserRequest: UpdateUserRequest) => {
            assertUser();
            return await userService.updateUser(updateUserRequest);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["user"]});
        },
    });
    const updateUserUserInfo = async (
        email: string,
        firstname: string,
        lastname: string,
        phoneNumber: string,
        gender: UpdateUserRequestGenderEnum,
        subscribedToEmail: boolean
    ) => {
        if (!user) return;
        const request: UpdateUserRequest = {
            email,
            firstname,
            lastname,
            phoneNumber,
            gender,
            subscribedToEmail,
            shippingAddress: toAddressRequest(user.shippingAddress),
            billingAddress: toAddressRequest(user.billingAddress),
        };
        await updateUserMutation(request);
    };

    const updateShippingAddress = async (newShippingAddress: AddressRequest) => {
        if (!user) return;
        const request: UpdateUserRequest = {
            email: user.email,
            firstname: user.firstname ?? "",
            lastname: user.lastname ?? "",
            phoneNumber: user.phoneNumber ?? "",
            gender: user.gender,
            subscribedToEmail: user.subscribedToEmail,
            shippingAddress: newShippingAddress,
            billingAddress: toAddressRequest(user.billingAddress),
        };
        await updateUserMutation(request);
    };

    const updateBillingAddress = async (newBillingAddress: AddressRequest) => {
        if (!user) return;
        const request: UpdateUserRequest = {
            email: user.email,
            firstname: user.firstname ?? "",
            lastname: user.lastname ?? "",
            phoneNumber: user.phoneNumber ?? "",
            gender: user.gender,
            subscribedToEmail: user.subscribedToEmail,
            billingAddress: newBillingAddress,
            shippingAddress: toAddressRequest(user.shippingAddress),
        };
        await updateUserMutation(request);
    };

    const updateUser = async (req: UpdateUserRequest) => {
        await updateUserMutation(req);
    };

    return {
        updateUserUserInfo,
        updateShippingAddress,
        updateBillingAddress,
        updateUser,
        isPending: isPending,
    };
};
