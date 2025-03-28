import React from "react";
import {ProductStatisticsResponse, UserStatisticsResponse} from "../../../shared/api";
import {Card, CardContent, CardHeader} from "../../ui/Card";
import {Tooltip, TooltipContent, TooltipTrigger} from "../../ui/Tooltip";
import {cn} from "../../../lib/utils";
import {Separator} from "../../ui/Separator";

type Variant =
    | "spending-users"
    | "ordering-users"
    | "ordered-products"
    | "saved-products"
    | "returned-products";

type Props = {
    title: string;
    items: UserStatisticsResponse[] | ProductStatisticsResponse[];
    variant: Variant;
};

const ListStatistics: React.FC<Props> = ({title, items, variant}) => {
    const isUserStats = (item: any): item is UserStatisticsResponse =>
        "email" in item || "fullName" in item;

    return (
        <Card className=" shadow-sm p-4">
            <CardHeader className="pb-0">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="text-sm text-muted-foreground px-3 py-2">
                        No data available.
                    </div>
                ) : (
                    <ul>
                        {items.map((item, index) => {
                            const displayName = isUserStats(item)
                                ? `${item.fullName ?? "Unknown"} (${item.email ?? "No email"})`
                                : `${item.product?.brand?.name ?? "No Brand"} - ${item.product?.name ?? "Unnamed"}`;

                            const displayValue = isUserStats(item)
                                ? variant === "spending-users"
                                    ? `$${(item.amount ?? 0).toFixed(2)}`
                                    : `x${item.amount ?? 0}`
                                : `x${item.count ?? 0}`;

                            const tooltipText = isUserStats(item)
                                ? variant === "spending-users"
                                    ? `${item.fullName ?? "Unknown"} spent $${(item.amount ?? 0).toFixed(2)}`
                                    : `${item.fullName ?? "Unknown"} placed ${item.amount ?? 0} orders`
                                : `${item.product?.name ?? "Unnamed"} ${
                                    variant === "ordered-products"
                                        ? `was ordered`
                                        : variant === "saved-products"
                                            ? `was saved`
                                            : `was returned`
                                } ${item.count ?? 0} times`;

                            return (
                                <li key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div
                                                className={cn(
                                                    "flex justify-between items-center px-3 py-2 rounded-md",
                                                    "hover:bg-muted transition-colors"
                                                )}
                                            >
                                                <span className="truncate font-medium">{displayName}</span>
                                                <span className="text-muted-foreground text-sm">{displayValue}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>{tooltipText}</TooltipContent>
                                    </Tooltip>
                                    {index !== items.length - 1 && <Separator />}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default ListStatistics;
