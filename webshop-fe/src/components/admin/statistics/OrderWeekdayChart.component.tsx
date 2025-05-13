import React from "react";
import {WeeklyOrderStatisticsResponse} from "@/shared/api";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent
} from "../../ui/chart.tsx";
import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";
import {Card, CardContent, CardHeader} from "../../ui/card.tsx";
import {cn} from "@/lib/utils.ts";

type Props = {
    data: WeeklyOrderStatisticsResponse[];
    className?: string;
};

const chartConfig = {
    orderCount: {
        label: "Order Count",
        color: "var(--chart-1)",
    }
} satisfies ChartConfig

const formatDayOfWeek = (value: string) => {
    const lower = value.toLowerCase();
    const day = lower.charAt(0).toUpperCase() + lower.slice(1);
    return day.slice(0, 3);
};

const OrderWeekdayChart: React.FC<Props> = ({data, className}) => {

    return (
        <Card className={cn("", className)}>
            <CardHeader>
                <h3 className="text-lg font-semibold">Orders by Day of Week</h3>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="dayOfWeek"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={formatDayOfWeek}
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="dashed"/>}/>
                        <ChartLegend content={<ChartLegendContent/>}/>
                        <Bar dataKey="orderCount" fill="var(--color-orderCount)" radius={4}/>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};

export default OrderWeekdayChart;
