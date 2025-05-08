import React from 'react';
import EmptyState from "../../components/storefront/shared/EmptyPage.component";
import {OrderResponse} from "@/shared/api";
import OrderItem from "../../components/storefront/order/Order.component";
import PageContainer from "../../components/shared/PageContainer.component";
import PageHeader from "../../components/shared/PageHeader";
import PageTitle from "../../components/shared/PageTitle";
import PageContent from "../../components/shared/PageContent";
import {useUserOrders} from "@/hooks/order/useUserOrders.ts";

const PreviousOrders: React.FC = () => {
    const {orders} = useUserOrders()

    const sortedOrders = [...orders].sort((a, b) => {
        const dateA = new Date(a.orderDate ?? 0).getTime();
        const dateB = new Date(b.orderDate ?? 0).getTime();
        return dateB - dateA;
    });

    return sortedOrders.length > 0 ? (
        <PageContainer layout="spacious" className="relative">
            <PageHeader>
                <PageTitle>Previous Orders</PageTitle>
                <p className="text-lg font-semibold">
                    <span className="text-indigo-600">{sortedOrders.length}</span> orders made
                </p>
            </PageHeader>
            <PageContent className="flex flex-col gap-4">
                {sortedOrders.map((order: OrderResponse) => {
                    return (
                        <div key={order.id}>
                            <OrderItem order={order}/>
                        </div>
                    );
                })}
            </PageContent>
        </PageContainer>
    ) : (
        <PageContainer layout="centered" className="space-y-3 py-20">
            <EmptyState title="You don't have any orders!"/>
        </PageContainer>
    );
};

export default PreviousOrders;
