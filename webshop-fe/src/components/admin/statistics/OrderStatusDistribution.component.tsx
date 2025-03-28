"use client"

import {TrendingUp} from "lucide-react"
import {Label, Pie, PieChart, Sector} from "recharts"

import {OrderStatusDistributionResponse} from "../../../shared/api"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "../../ui/Chart";
import React from "react";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../../ui/Card";
import {PieSectorDataItem} from "recharts/types/polar/Pie";

type Props = {
    data: OrderStatusDistributionResponse
    className?: string
}

const chartConfig = {
    orders: {
        label: "Orders",
    },
    pending: {
        label: "Pending",
        color: "hsl(var(--chart-1))",
    },
    processing: {
        label: "Processing",
        color: "hsl(var(--chart-2))",
    },
    shipped: {
        label: "Shipped",
        color: "hsl(var(--chart-3))",
    },
    returned: {
        label: "Returned",
        color: "hsl(var(--chart-4))",
    },
    cancelled: {
        label: "Cancelled",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export const OrderStatusChart: React.FC<Props> = ({data, className}) => {
    const chartData = [
        {
            status: "pending",
            orders: data.pendingOrders,
            fill: "var(--color-pending)",
        },
        {
            status: "processing",
            orders: data.processingOrders,
            fill: "var(--color-processing)",
        },
        {
            status: "shipped",
            orders: data.shippedOrders,
            fill: "var(--color-shipped)",
        },
        {
            status: "returned",
            orders: data.returnedOrders,
            fill: "var(--color-returned)",
        },
        {
            status: "cancelled",
            orders: data.cancelledOrders,
            fill: "var(--color-cancelled)",
        },
    ]

    const totalOrders =
        (data.pendingOrders ?? 0) +
        (data.processingOrders ?? 0) +
        (data.shippedOrders ?? 0) +
        (data.returnedOrders ?? 0) +
        (data.cancelledOrders ?? 0);

    return (
        <Card className={className}>
            <CardHeader className="items-center pb-0">
                <CardTitle>Order Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] w-full px-0"
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="status" hideLabel/>}
                        />
                        <Pie
                            data={chartData}
                            dataKey="orders"
                            nameKey="status"
                            innerRadius={60}
                            labelLine={false}
                            label={({payload, ...props}) => {
                                return (
                                    <text
                                        cx={props.cx}
                                        cy={props.cy}
                                        x={props.x}
                                        y={props.y}
                                        textAnchor={props.textAnchor}
                                        dominantBaseline={props.dominantBaseline}
                                        fill="hsla(var(--foreground))"
                                    >
                                        {payload.orders}
                                    </text>
                                )
                            }}
                            activeIndex={2}
                            activeShape={({
                                              outerRadius = 0,
                                              ...props
                                          }: PieSectorDataItem) => (
                                <Sector {...props} outerRadius={outerRadius + 10}/>
                            )}
                        >
                            <Label
                                content={({viewBox}) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalOrders.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Orders
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}/>
                        </Pie>
                        <ChartLegend
                            content={<ChartLegendContent/>}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />

                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Order volume steady this month <TrendingUp className="h-4 w-4"/>
                </div>
                <div className="leading-none text-muted-foreground">
                    Visual breakdown of order statuses
                </div>
            </CardFooter>
        </Card>
    )
}
