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
 * Generates a product URL based on provided parameters.
 * Ensures that undefined or null values are skipped.
 *
 * @param gender - Product gender category (e.g., "men", "women")
 * @param category - Product category name (e.g., "shoes")
 * @param subCategory - Product sub-category name (e.g., "sneakers")
 * @param name - Product name (e.g., "air-jordan-1")
 * @param id - Product ID (e.g., "12345")
 * @returns A properly formatted URL path (e.g., "/products/men/shoes/sneakers/air-jordan-1/12345")
 */
export const generateProductUrl = (
    gender?: string,
    category?: string,
    subCategory?: string,
    name?: string,
    id?: string | number
): string => {
    const segments = ["products", gender, category, subCategory, name, id]
        .filter((segment): segment is string | number => segment !== undefined && segment !== null)
        .map((segment) => encodeURIComponent(String(segment)));

    return `/${segments.join("/")}`;
};

export const toLogin = "/authentication?type=login"
