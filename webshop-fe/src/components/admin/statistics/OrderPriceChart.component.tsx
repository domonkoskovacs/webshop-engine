"use client"

import * as React from "react"


import {OrderPriceStatisticsResponse} from "@/shared/api"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "../../ui/chart";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../ui/select";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis} from "recharts";
import {cn} from "@/lib/utils.ts";
import {Switch} from "../../ui/switch";

type Props = {
    data: OrderPriceStatisticsResponse[],
    className?: string
}

const chartConfig = {
    price: {
        label: "Order Value",
    },
    totalOrderPriceSum: {
        label: "Total",
        color: "hsl(var(--chart-1))",
    },
    completedOrderPriceSum: {
        label: "Completed",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const OrderPriceChart: React.FC<Props> = ({data, className}) => {
    const [timeRange, setTimeRange] = React.useState("max")
    const [showCompletedOnly, setShowCompletedOnly] = React.useState(false)

    const totalDays = React.useMemo(() => {
        const sorted = [...data].sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
        if (sorted.length < 2) return 1

        const first = new Date(sorted[0].date!)
        const last = new Date(sorted[sorted.length - 1].date!)
        const diff = Math.round((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24))
        return diff + 1
    }, [data])

    const filteredData = React.useMemo(() => {
        if (timeRange === "max") return data

        const referenceDate = new Date()
        const startDate = new Date(referenceDate)
        const daysToSubtract = timeRange === "30d" ? 30 : 7
        startDate.setDate(referenceDate.getDate() - daysToSubtract)

        return data.filter((entry) => {
            if (!entry.date) return false
            const entryDate = new Date(entry.date)
            return entryDate >= startDate
        })
    }, [data, timeRange])

    return (
        <Card className={cn("", className)}>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b flex-row">
                <div className="grid flex-1 gap-1 sm:text-left">
                    <CardTitle>Order Value Over Time</CardTitle>
                    <CardDescription>Track total vs completed order amounts</CardDescription>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 justify-center sm:items-center ml-auto">
                    <div className="flex items-center gap-2">
                        <label htmlFor="completed-only-switch" className="text-sm">
                            Show only completed
                        </label>
                        <Switch
                            id="completed-only-switch"
                            checked={showCompletedOnly}
                            onCheckedChange={setShowCompletedOnly}
                        />
                    </div>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[160px] rounded-lg" aria-label="Select a range">
                            <SelectValue
                                placeholder={
                                    timeRange === "max"
                                        ? `Max (${totalDays} days)`
                                        : timeRange === "30d"
                                            ? "Last 30 days"
                                            : "Last 7 days"
                                }
                            />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="max" className="rounded-lg">
                                Max ({totalDays} days)
                            </SelectItem>
                            {totalDays >= 30 && (
                                <SelectItem value="30d" className="rounded-lg">
                                    Last 30 days
                                </SelectItem>
                            )}
                            {totalDays >= 7 && (
                                <SelectItem value="7d" className="rounded-lg">
                                    Last 7 days
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-totalOrderPriceSum)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-totalOrderPriceSum)" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-completedOrderPriceSum)" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="var(--color-completedOrderPriceSum)" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            domain={[0, "dataMax + 50"]}
                            tickFormatter={(value) =>
                                new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    maximumFractionDigits: 0,
                                }).format(value)
                            }
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }
                                    indicator="dot"
                                />
                            }
                        />
                        {!showCompletedOnly && (
                            <Area
                                dataKey="totalOrderPriceSum"
                                name="Total"
                                fill="url(#fillTotal)"
                                stroke="var(--color-totalOrderPriceSum)"
                                type="monotone"
                                strokeWidth={2}
                            />
                        )}
                        <Area
                            dataKey="completedOrderPriceSum"
                            name="Completed"
                            fill="url(#fillCompleted)"
                            stroke="var(--color-completedOrderPriceSum)"
                            type="monotone"
                            strokeWidth={2}
                        />
                        <ChartLegend content={<ChartLegendContent/>}/>
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Based on order totals in the selected time period
                </div>
            </CardFooter>
        </Card>
    )
}

export default OrderPriceChart
