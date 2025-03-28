import React from "react";
import {Label, Pie, PieChart} from "recharts";
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "../../ui/Chart";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../../ui/Card";
import {cn} from "../../../lib/utils";
import {CustomerTypeDistributionResponse} from "../../../shared/api";

type Props = {
    data: CustomerTypeDistributionResponse;
    className?: string;
};

const chartConfig = {
    newCustomers: {
        label: "New Customers",
        color: "hsl(var(--chart-2))",
    },
    returningCustomers: {
        label: "Returning Customers",
        color: "hsl(var(--chart-4))",
    },
};

const CustomerTypeChart: React.FC<Props> = ({data, className}) => {
    const newCount = data?.newCustomers ?? 0;
    const returningCount = data?.returningCustomers ?? 0;
    const totalCustomers = newCount + returningCount;

    // 👇 Guard clause — wait until data is meaningful
    if (!totalCustomers) {
        return (
            <Card className={cn("", className)}>
                <CardHeader className="items-center pb-0">
                    <CardTitle>Customer Type Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center min-h-[200px] text-muted-foreground">
                    Loading data...
                </CardContent>
            </Card>
        );
    }
    const chartData = [
        {
            name: chartConfig.newCustomers.label,
            value: data.newCustomers ?? 0,
            fill: "var(--color-newCustomers)"},
        {
            name: chartConfig.returningCustomers.label,
            value: data.returningCustomers ?? 0,
            fill: "var(--color-returningCustomers)"
        },
    ];

    return (
        <Card className={className}>
            <CardHeader className="items-center pb-0">
                <CardTitle>Customer Type Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] w-full"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel/>}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
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
                                                    {totalCustomers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Customers
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    {data.returningCustomers ?? 0 > (data.newCustomers ?? 0)
                        ? "Returning customers dominate this period"
                        : "New customer growth is leading this period"}
                </div>
                <div className="leading-none text-muted-foreground">
                    Based on total orders on the selected time period
                </div>
            </CardFooter>

        </Card>
    );
};

export default CustomerTypeChart;
