import {BreadcrumbSegment} from "../components/shared/PathBreadcrumb.component";
import {GetAll1GendersEnum, GetAll1SortTypeEnum, ProductServiceApiGetAll1Request} from "@/shared/api";
import {AppPaths} from "../routing/AppPaths";

/**
 * Extracts path segments from a given URL path.
 * @param pathname The current URL path (e.g., "/admin/articles/edit")
 * @returns An array of path segments (e.g., ["admin", "articles", "edit"])
 */
export const getPathSegments = (pathname: string): string[] => {
    return pathname.split("/").filter((segment) => segment);
};

/**
 * Generates breadcrumb segments from a given URL path.
 * @param pathname The current URL path
 * @returns An array of breadcrumb objects with segment names and paths
 */
export const generateBreadcrumbSegments = (pathname: string) => {
    const pathSegments = getPathSegments(pathname);

    return pathSegments.map((segment, index) => ({
        segmentName: decodeURIComponent(segment), // Decode URL-encoded segments
        path: `/${pathSegments.slice(0, index + 1).join("/")}`
    }));
};

/**
 * Helper function that attaches query parameters to a URL.
 * @param url The base URL.
 * @param query An object representing query parameters.
 * @returns The URL with encoded query parameters appended.
 */
export const attachQueryParams = (
    url: string,
    query?: Record<string, string | number | undefined>
): string => {
    if (!query) return url;
    const searchParams = new URLSearchParams();
    for (const key in query) {
        const value = query[key];
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    }
    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
};

/**
 * Generates a product URL based on provided parameters.
 * Ensures that undefined or null values are skipped.
 *
 * @param gender - Product gender category (e.g., "men", "women")
 * @param category - Product category name (e.g., "shoes")
 * @param subCategory - Product sub-category name (e.g., "sneakers")
 * @param name - Product name (e.g., "air-jordan-1")
 * @param id - Product ID (e.g., "12345")
 * @param query - Optional query parameters to attach to the URL.
 * @returns A properly formatted URL path with optional query parameters.
 *          e.g., "/products/men/shoes/sneakers/air-jordan-1/12345?brand=Nike"
 */
export const generateProductUrl = (
    gender?: string,
    category?: string,
    subCategory?: string,
    name?: string,
    id?: string | number,
    query?: Record<string, string | number | undefined>
): string => {
    const segments = ["products", gender, category, subCategory, name, id]
        .filter((segment): segment is string | number => segment !== undefined && segment !== null)
        .map((segment) => encodeURIComponent(String(segment)));

    const url = `/${segments.join("/")}`;
    return attachQueryParams(url, query);
};

export const toLogin = `${AppPaths.AUTHENTICATION}?type=login`;
;

/**
 * Generates a product list URL based on provided parameters.
 * Ensures that empty values are replaced with an empty string and removes trailing slashes.
 *
 * @param gender - Product gender category (optional)
 * @param category - Product category name (optional)
 * @param subcategory - Product sub-category name (optional)
 * @param query - Optional query parameters to attach to the URL.
 * @returns A properly formatted URL path with optional query parameters.
 *          e.g., "/products/men/shoes/sneakers?brand=Nike"
 */
export const generateProductListUrl = (
    gender?: string | null,
    category?: string | null,
    subcategory?: string | null,
    query?: Record<string, string | number | undefined>
): string => {
    const segments = ["products", gender ?? "", category ?? "", subcategory ?? ""];
    const url = `/${segments.join("/")}`.replace(/\/+$/, "");
    return attachQueryParams(url, query);
};

/**
 * Generates breadcrumb segments for product pages.
 * It returns an array with:
 *  - "Products" always as the first segment,
 *  - then gender, category, subCategory (if provided),
 *  - and finally the product name. If an id exists, it is appended to the product URL.
 *
 * @param gender Product gender category (optional)
 * @param category Product category (optional)
 * @param subcategory Product sub-category (optional)
 * @param name Product name (optional)
 * @param id Product id (optional)
 * @returns Array of breadcrumb objects with { segmentName, path }.
 */
export const generateProductBreadcrumbSegments = ({
                                                      gender,
                                                      category,
                                                      subcategory,
                                                      name,
                                                      id,
                                                  }: {
    gender?: string | null;
    category?: string | null;
    subcategory?: string | null;
    name?: string | null;
    id?: string | number | null;
}): BreadcrumbSegment[] => {
    return [
        {segmentName: "Products", path: "/products"},
        gender && {segmentName: decodeURIComponent(gender), path: `/products/${gender}`},
        category && {segmentName: decodeURIComponent(category), path: `/products/${gender}/${category}`},
        subcategory && {
            segmentName: decodeURIComponent(subcategory),
            path: `/products/${gender}/${category}/${subcategory}`
        },
        name && {
            segmentName: decodeURIComponent(name),
            path: `/products/${gender}/${category}/${subcategory}/${name}${id ? `/${id}` : ""}`,
        },
    ].filter((segment): segment is BreadcrumbSegment => Boolean(segment));
};

type MutableFilters = {
    -readonly [K in keyof ProductServiceApiGetAll1Request]: ProductServiceApiGetAll1Request[K];
};

/**
 * Parses filters from the URL.
 *
 * @param pathname - The URL pathname (e.g. "/products/women/Shoes/Sneakers")
 * @param search - The query string (e.g. "?brands=nike,adidas&maxPrice=200")
 * @returns A partial filter object derived from the URL.
 */
export function parseFiltersFromUrl(
    pathname: string,
    search: string
): Partial<ProductServiceApiGetAll1Request> {
    const urlObj = new URL(pathname + search, window.location.origin);
    const params = new URLSearchParams(urlObj.search);
    const filters: Partial<MutableFilters> = {};
    const pathSegments = urlObj.pathname.split("/").filter(Boolean);
    const decodedSegments = pathSegments.map(segment => decodeURIComponent(segment));

    if (decodedSegments.length > 1) {
        filters.genders = [
            decodedSegments[1].toUpperCase() as GetAll1GendersEnum,
            GetAll1GendersEnum.Unisex,
        ];
    }
    if (decodedSegments.length > 2) {
        filters.categories = [decodedSegments[2]];
    }
    if (decodedSegments.length > 3) {
        filters.subCategories = [decodedSegments[3]];
    }

    const queryFilterKeys: (keyof ProductServiceApiGetAll1Request)[] = [
        "brands",
        "maxPrice",
        "minPrice",
        "maxDiscountPercentage",
        "minDiscountPercentage",
        "itemNumber",
        "showOutOfStock",
        "sortType",
    ];

    queryFilterKeys.forEach((key) => {
        if (params.has(key)) {
            const value = params.get(key);
            if (value !== null) {
                switch (key) {
                    case "maxPrice":
                    case "minPrice":
                    case "maxDiscountPercentage":
                    case "minDiscountPercentage":
                        filters[key] = Number(value) as ProductServiceApiGetAll1Request[typeof key];
                        break;
                    case "showOutOfStock":
                        filters[key] = (value === "true") as ProductServiceApiGetAll1Request[typeof key];
                        break;
                    case "brands":
                        filters[key] = value.split(",") as ProductServiceApiGetAll1Request[typeof key];
                        break;
                    case "sortType":
                        if (Object.values(GetAll1SortTypeEnum).includes(value as GetAll1SortTypeEnum)) {
                            filters[key] = value as ProductServiceApiGetAll1Request[typeof key];
                        }
                        break;
                    case "itemNumber":
                        filters[key] = value as ProductServiceApiGetAll1Request[typeof key];
                        break;
                    default:
                        break;
                }
            }
        }
    });

    return filters;
}