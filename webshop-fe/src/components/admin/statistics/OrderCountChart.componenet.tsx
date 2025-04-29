import * as React from "react"
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import {OrderCountStatisticsResponse} from "@/shared/api";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "../../ui/chart";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../ui/card";
import {cn} from "@/lib/utils.ts";
import {TrendingUp} from "lucide-react";
import {Label} from "../../ui/label";
import {Switch} from "../../ui/switch";

type Props = {
    data: OrderCountStatisticsResponse[]
    averageOrderValue?: number
    className?: string
}

const chartConfig = {
    totalOrderCount: {
        label: "Total",
        color: "hsl(var(--chart-1))",
    },
    completedOrderCount: {
        label: "Completed",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

const OrderCountChart: React.FC<Props> = ({
                                              data,
                                              averageOrderValue,
                                              className,
                                          }) => {
    const [showCompletedOnly, setShowCompletedOnly] = React.useState(false)

    return (
        <Card className={cn("", className)}>
            <CardHeader className="flex items-center gap-4 sm:flex-row sm:items-start">
                <div className="flex-1">
                    <CardTitle>Order Count Trends</CardTitle>
                    <CardDescription>
                        Daily order count trends over the selected period
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="showCompleted" className="text-sm">
                        Show only completed
                    </Label>
                    <Switch
                        id="showCompleted"
                        checked={showCompletedOnly}
                        onCheckedChange={setShowCompletedOnly}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <LineChart
                        data={data}
                        margin={{left: 12, right: 12}}
                    >
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
                            allowDecimals={false}
                            domain={[0, "dataMax + 1"]}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    indicator="dot"
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                />
                            }
                        />
                        {!showCompletedOnly && (
                            <Line
                                dataKey="totalOrderCount"
                                name="Total"
                                type="monotone"
                                stroke="var(--color-totalOrderCount)"
                                strokeWidth={2}
                                dot={{
                                    fill: "var(--color-totalOrderCount)",
                                }}
                            />
                        )}
                        <Line
                            dataKey="completedOrderCount"
                            name="Completed"
                            type="monotone"
                            stroke="var(--color-completedOrderCount)"
                            strokeWidth={2}
                            dot={{
                                fill: "var(--color-completedOrderCount)",
                            }}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Order activity remains steady <TrendingUp className="h-4 w-4"/>
                </div>
                <div className="leading-none text-muted-foreground">
                    {`Based on daily totals in the selected period${averageOrderValue !== undefined ? `, with an average of ${averageOrderValue.toFixed(2)} orders per day.` : "."}`}
                </div>
            </CardFooter>
        </Card>
    )
}

export default OrderCountChart
