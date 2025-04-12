import React from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Button} from "../../ui/Button";

import PageContainer from "../../shared/PageContainer.component";
import EmptyState from "../shared/EmptyPage.component";
import ProductGallery from "./ProductGallery.componenet";
import {generateProductBreadcrumbSegments, generateProductListUrl} from "../../../lib/url.utils";
import PathBreadcrumb from "../../shared/PathBreadcrumb.component";
import {useGender} from "../../../hooks/useGender";
import {ChevronLeft, Container, CornerDownLeft, Heart, PlusIcon} from "lucide-react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../ui/Accordition";
import {calculateDiscountedPrice} from "../../../lib/price.utils";
import {Badge} from "../../ui/Badge";
import {useUser} from "../../../hooks/UseUser";
import {usePublicStore} from "../../../hooks/store/usePublicStore";
import {useProductById} from "../../../hooks/product/useProductById";

const ProductDetails: React.FC = () => {
    const {toggleSaved, addItemToCart, isSaved} = useUser();
    const {data: store} = usePublicStore()
    const navigate = useNavigate();
    const {gender} = useGender()
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const category = pathSegments[2] || null;
    const subcategory = pathSegments[3] || null;
    const name = pathSegments[4] || null;
    const id = pathSegments[5] || null;
    const breadcrumbSegments = generateProductBreadcrumbSegments({gender, category, subcategory, name, id})
    const {data: product, isLoading, isError} = useProductById(id ?? "");
    const savedProduct = isSaved(product?.id!);

    if (isLoading) {
        return <PageContainer className="my-10"><EmptyState title=""/></PageContainer>
    }

    if (isError || !product) {
        return (
            <PageContainer className="my-10 gap-3">
                <h1 className="text-5xl font-bold text-red-600">404</h1>
                <p className="text-2xl">Product Not Found</p>
                <p className="text-2xl">The product you are looking for does not exist.</p>
                <Button onClick={() => navigate(-1)}>Go back</Button>
            </PageContainer>
        );
    }

    const fullPrice = product.price || 0;
    const discountPercentage = product.discountPercentage || 0;
    const discountedPrice = calculateDiscountedPrice(fullPrice, discountPercentage);

    return (
        <PageContainer layout="spacious"
                       className="mx-4 flex flex-col items-center justify-center md:flex-row gap-3 relative max-w-6xl">
            <div className="w-full md:w-auto md:sticky top-2 self-start">
                <ProductGallery product={product}/>
            </div>

            <div className="mx-2 flex flex-col gap-4">
                <div className="flex flex-row items-center gap-2">
                    <Button variant="ghost" className="h-full" onClick={() => navigate(-1)}>
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    <PathBreadcrumb segments={breadcrumbSegments}/>
                </div>
                <Link
                    to={generateProductListUrl(gender, product.category?.name, product.subCategory?.name, {
                        brand: product.brand?.name,
                    })}
                >
                    <h1 className="text-3xl font-bold hover:underline cursor-pointer">
                        {product.brand?.name}
                    </h1>
                </Link>
                <h1 className="text-xl">{product.name}</h1>
                <div className="space-y-2">
                    {discountPercentage > 0 ? (
                        <div>
                            <p className="text-xl line-through text-gray-500">${fullPrice.toFixed(2)}</p>
                            <p className="text-2xl font-bold text-red-600 ">
                                ${discountedPrice.toFixed(2)} <Badge
                                className="text-sm font-normal bg-red-600 text-white">(-{discountPercentage}%)</Badge>
                            </p>
                        </div>
                    ) : (
                        <p className="text-xl font-semibold">Price: ${fullPrice.toFixed(2)}</p>
                    )}
                </div>
                <div className="w-full flex flex-row gap-2">
                    <Button className="w-full" onClick={() => addItemToCart(product.id!)}><PlusIcon
                        className="size-4 me-1"/> Add to
                        cart</Button>
                    <Button
                        variant="ghost"
                        onClick={() => toggleSaved(product.id!)}
                        className={`transition ${
                            savedProduct ? "bg-red-500" : "hover:bg-red-500"
                        }`}
                    >
                        <Heart/>
                    </Button>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded">
                    <span className="text-sm font-semibold">Stock:</span>
                    {product.count && product.count > 0 ? (
                        <span className="text-sm text-green-600">{product.count} available</span>
                    ) : (
                        <span className="text-sm text-red-600">Out of Stock</span>
                    )}
                </div>
                <Accordion type="multiple" className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Description</AccordionTrigger>
                        <AccordionContent>
                            {product.description}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Manufacturer Information</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-justify">
                                <strong>Brand:</strong> {product.brand?.name || "N/A"}
                            </p>
                            <p className="text-justify">
                                {product.brand?.name
                                    ? `${product.brand.name} is known for its exceptional quality and innovative designs. This product is manufactured under strict quality controls to ensure the highest standards.`
                                    : "No manufacturer information available."}
                            </p>
                            <p className="text-justify">
                                <strong>Item Number:</strong> {product.itemNumber}
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Target audience</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-justify">
                                {product.gender === 'MEN'
                                    ? 'This product is designed for Men.'
                                    : product.gender === 'WOMEN'
                                        ? 'This product is designed for Women.'
                                        : product.gender === 'UNISEX'
                                            ? 'This product is designed for both Men and Women.'
                                            : 'This product is designed for all audiences.'}
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>Categorization</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-justify">
                                <strong>Category:</strong> {product.category?.name || "N/A"}
                            </p>
                            <p className="text-justify">
                                <strong>Sub Category:</strong> {product.subCategory?.name || "N/A"}
                            </p>
                            <p className="text-justify">
                                {product.category?.name && product.subCategory?.name
                                    ? `Products in the ${product.category.name} category are known for their high quality and reliability, while the ${product.subCategory.name} sub-category offers a more specialized selection tailored to specific needs.`
                                    : "Additional categorization details are not available."}
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div className="flex flex-col gap-2">
                    <div
                        className="w-full flex items-center gap-2 p-3 border rounded bg-blue-50 border-blue-300 shadow-sm dark:bg-blue-900 dark:border-blue-700">
                        <Container className="w-4 h-4 text-blue-600 dark:text-blue-300"/>
                        <span className="text-sm text-blue-800 dark:text-blue-100">
                            Shipping: ${store?.shippingPrice ?? "N/A"}
                        </span>
                    </div>
                    <div
                        className="w-full flex items-center gap-2 p-3 border rounded bg-yellow-50 border-yellow-300 shadow-sm dark:bg-yellow-900 dark:border-yellow-700">
                        <CornerDownLeft className="w-4 h-4 text-yellow-600 dark:text-yellow-300"/>
                        <span className="text-sm text-yellow-800 dark:text-yellow-100">
                            Return: {store?.returnPeriod ?? "N/A"} days
                        </span>
                    </div>
                </div>
                <Accordion type="multiple" className="w-full">
                    <AccordionItem value="returnPolicy">
                        <AccordionTrigger>Return Policy</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-justify">
                                Our return policy is designed to ensure your complete satisfaction with your purchase.
                                If for any reason you are not fully satisfied, you may return your item within 30 days
                                of receipt. To qualify for a return, the product must be in its original condition,
                                unused, and in its original packaging. Please note that items that have been used,
                                damaged, or altered in any way may not be eligible for a full refund.
                            </p>
                            <p className="mt-2 text-justify">
                                Shipping charges are non-refundable, except in cases where an error on our part has
                                occurred. To initiate a return, please contact our customer service team at
                                support@example.com or call (123) 456-7890. Once your return request is approved, you
                                will receive detailed instructions on how to proceed. Refunds will be processed to your
                                original form of payment within 5–7 business days following receipt and inspection of
                                the returned item.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="legal">
                        <AccordionTrigger>Legal Information</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-justify">
                                The information provided on our website is for general informational purposes only. We
                                make no representations or warranties, express or implied, regarding the completeness,
                                accuracy, reliability, suitability, or availability of any information, products,
                                services, or related graphics contained on this site. Any reliance you place on such
                                information is strictly at your own risk.
                            </p>
                            <p className="mt-2 text-justify">
                                In no event shall we be liable for any loss or damage including, without limitation,
                                indirect or consequential loss or damage, or any loss or damage whatsoever arising from
                                loss of data or profits arising out of, or in connection with, the use of this website.
                                Links provided on this site to third-party websites are offered for convenience only; we
                                do not endorse the content or practices of those sites.
                            </p>
                            <p className="mt-2 text-justify">
                                Should you have any questions or concerns regarding our products, services, or these
                                terms, please contact our legal department via our{" "}
                                <Link
                                    to="/contact"
                                    className="underline dark:text-blue-400"
                                >
                                    Contact Us
                                </Link>{" "}
                                page or call (123) 456-7891. Your use of our website indicates your acceptance of
                                these terms, and any disputes will be governed by the applicable laws of our
                                jurisdiction. For more details, please review our{" "}
                                <Link
                                    to="/privacy-policy"
                                    className="underline dark:text-blue-400"
                                >
                                    Privacy Policy
                                </Link>{" "}
                                and{" "}
                                <Link
                                    to="/terms-and-conditions"
                                    className="underline dark:text-blue-400"
                                >
                                    Terms and Conditions
                                </Link>.
                            </p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <div
                    className="mt-6 p-4 border rounded bg-muted flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <h3 className="text-xl font-bold text-muted-foreground">
                            Have Questions?
                        </h3>
                        <p className="text-muted-foreground">
                            For any usual queries or further information, please visit our FAQ section.
                        </p>
                    </div>
                    <Link to="/faq">
                        <Button className="w-full sm:w-auto">Read our FAQ</Button>
                    </Link>
                </div>
            </div>
        </PageContainer>
    );
};

export default ProductDetails;
