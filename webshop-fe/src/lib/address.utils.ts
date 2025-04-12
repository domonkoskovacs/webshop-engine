import {AddressRequest, AddressResponse} from "../shared/api";

/**
 * Safely maps an AddressResponse to AddressRequest.
 * Throws an error if any required field is missing.
 */
export const toAddressRequest = (
    address?: AddressResponse
): AddressRequest | undefined => {
    if (!address) return undefined;

    const {
        city,
        country,
        floorNumber,
        street,
        streetNumber,
        zipCode,
    } = address;

    if (
        city == null ||
        country == null ||
        floorNumber == null ||
        street == null ||
        streetNumber == null ||
        zipCode == null
    ) {
        throw new Error("Incomplete address: missing required field(s)");
    }

    return {
        city,
        country,
        floorNumber,
        street,
        streetNumber,
        zipCode,
    };
};
