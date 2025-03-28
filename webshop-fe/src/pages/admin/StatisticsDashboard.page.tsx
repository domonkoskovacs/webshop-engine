import React, {useState} from 'react';
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageContent from "../../components/shared/PageContent";
import {Button} from "../../components/ui/Button";
import {useStatistics} from "../../hooks/UseStatistics";
import {Sheet, SheetContent, SheetTrigger} from "../../components/ui/Sheet";
import CustomizeViewForm from "../../components/admin/statistics/CustomizeViewForm.component";
import ListStatistics from "../../components/admin/statistics/ListStatistics.component";
import OrderWeekdayChart from "../../components/admin/statistics/OrderWeekdayChart.component";
import CustomerTypeChart from "../../components/admin/statistics/CustomerTypeChart.component";
import {OrderStatusChart} from "../../components/admin/statistics/OrderStatusDistribution.component";
import OrderPriceChart from "../../components/admin/statistics/OrderPriceChart.component";

const StatisticsDashboard: React.FC = () => {
    const {statistics, statisticsRequest} = useStatistics()
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <PageContainer layout="start">
            <PageHeader className="py-2 gap-2">
                <div className="flex flex-row gap-2">
                    <div
                        className="flex items-center gap-2 text-sm border border-border rounded-lg p-2.5 bg-background shadow-sm">
                        <span className="hidden sm:block font-medium text-foreground">Period:</span>
                        <span>{statisticsRequest.from}</span>
                        <span className="mx-1">-</span>
                        <span>{statisticsRequest.to}</span>
                    </div>
                    <div
                        className="flex items-center gap-2 text-sm border border-border rounded-lg p-2.5 bg-background shadow-sm">
                        <span className="font-medium text-foreground">Top:</span>
                        <span>{statisticsRequest.topCount}</span>
                    </div>
                </div>
                <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <SheetTrigger asChild>
                        <Button>
                            Customize View
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <CustomizeViewForm setIsOpen={setIsFormOpen}/>
                    </SheetContent>
                </Sheet>
            </PageHeader>
            <PageContent className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">

                <OrderPriceChart data={statistics.orderPrices ?? []} className="col-span-full" />

                <OrderWeekdayChart className="col-span-1 sm:col-span-2" data={statistics.orderByDayOfWeek ?? []}/>
                {statistics.orderStatusDistribution && <OrderStatusChart data={statistics.orderStatusDistribution}/>}
                {statistics.customerTypeDistribution && <CustomerTypeChart data={statistics.customerTypeDistribution}/>}

                <ListStatistics
                    title="Most Ordered Products"
                    items={statistics.mostOrderedProducts ?? []}
                    variant="ordered-products"
                />

                <ListStatistics
                    title="Most Saved Products"
                    items={statistics.mostSavedProducts ?? []}
                    variant="saved-products"
                />

                <ListStatistics
                    title="Most Returned Products"
                    items={statistics.mostReturnedProducts ?? []}
                    variant="returned-products"
                />

                <ListStatistics
                    title="Top Spending Users"
                    items={statistics.topSpendingUsers ?? []}
                    variant="spending-users"
                />

                <ListStatistics
                    title="Top Ordering Users"
                    items={statistics.topOrderingUsers ?? []}
                    variant="ordering-users"
                />

            </PageContent>
        </PageContainer>
    );
};

export default StatisticsDashboard;

