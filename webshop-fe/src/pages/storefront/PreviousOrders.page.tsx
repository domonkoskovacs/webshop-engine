import React from 'react';
import EmptyState from "../../components/storefront/shared/EmptyPage.component";
import {useUser} from "../../hooks/UseUser";
import {OrderResponse} from "../../shared/api";
import OrderItem from "../../components/storefront/order/OrderItem.component";

const PreviousOrders: React.FC = () => {
    const {orders} = useUser()

    return orders.length > 0 ? (
        <main className="w-full mx-10 mb-6 relative">
            <div className="flex flex-row justify-between  my-6">
                <h1 className="text-2xl font-bold">Previous Orders</h1>
                <p className="text-lg font-semibold">
                    <span className="text-indigo-600">{orders.length}</span> orders made
                </p>
            </div>
            <div
                className="w-full flex flex-col gap-4">
                {orders.map((order: OrderResponse) => {
                    return (
                        <div key={order.id}>
                            <OrderItem order={order}/>
                        </div>
                    );
                })}
            </div>
        </main>
    ) : (
        <div className="flex flex-col space-y-3 py-20">
            <EmptyState title="You don't have any orders!"/>
        </div>
    );
};

export default PreviousOrders;
