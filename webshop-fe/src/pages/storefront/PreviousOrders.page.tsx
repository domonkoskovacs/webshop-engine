import React from 'react';
import EmptyState from "../../components/storefront/shared/EmptyPage.component";
import {useUser} from "../../hooks/UseUser";
import {OrderResponse} from "../../shared/api";
import OrderItem from "../../components/storefront/order/OrderItem.component";
import PageContainer from "../../components/storefront/shared/PageContainer.component";
import PageHeader from "../../components/storefront/shared/PageHeader";
import PageTitle from "../../components/storefront/shared/PageTitle";
import PageContent from "../../components/storefront/shared/PageContent";

const PreviousOrders: React.FC = () => {
    const {orders} = useUser()

    return orders.length > 0 ? (
        <PageContainer layout="spacious" className="relative">
            <PageHeader>
                <PageTitle>Previous Orders</PageTitle>
                <p className="text-lg font-semibold">
                    <span className="text-indigo-600">{orders.length}</span> orders made
                </p>
            </PageHeader>
            <PageContent className="flex flex-col gap-4">
                {orders.map((order: OrderResponse) => {
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
