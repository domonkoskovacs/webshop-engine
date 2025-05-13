import {Card, CardContent, CardTitle} from "../../ui/card.tsx";
import React from "react";
import {cn} from "@/lib/utils.ts";

interface Props {
    totalRevenue?: number
    averageOrderValue?: number
    totalShippingCost?: number;
    className?: string
}

const SummaryCard: React.FC<Props> = ({totalRevenue, averageOrderValue, totalShippingCost, className}) => {
    const formatValue = (value?: number) =>
        value !== undefined
            ? `$${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`
            : "—";
    return (
        <Card className={cn("p-6 flex flex-col gap-4", className)}>
            <CardTitle className="text-xl">Revenue Overview</CardTitle>
            <CardContent className="flex flex-col gap-4">
                <div>
                    <div className="text-4xl font-bold">${totalRevenue?.toLocaleString()}</div>
                    <p className="text-muted-foreground text-sm mb-1">Total Revenue (incl. shipping)</p>
                </div>
                <div>
                    <div className="text-4xl font-bold">{formatValue(averageOrderValue)}</div>
                    <p className="text-muted-foreground text-sm mb-1">Average Order Value (excl. shipping)</p>
                </div>
                <div>
                    <div className="text-4xl font-bold">{formatValue(totalShippingCost)}</div>
                    <p className="text-muted-foreground text-sm mb-1">Total Shipping Collected</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default SummaryCard