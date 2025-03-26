import {ApiConfig} from "../shared/ApiConfig";
import {handleApiCall} from "../shared/ApiCall";
import {OrderServiceApi, OrderServiceApiGetAll4Request, OrderStatusRequestOrderStatusEnum} from "../shared/api";

class OrderService {
    private orderApi: OrderServiceApi

    constructor() {
        this.orderApi = new OrderServiceApi(ApiConfig.getConfig());
    }

    /**
     * Get all orders by filters
     */
    async getAll(orderRequest: OrderServiceApiGetAll4Request) {
        return handleApiCall(() =>
            this.orderApi.getAll4(orderRequest)
                .then(res => res?.data)
        );
    }

    /**
     * Get one order by id
     */
    async getById(id: string) {
        return handleApiCall(() =>
            this.orderApi.getById2({id})
                .then(res => res?.data)
        );
    }

    /**
     * Create a new order
     */
    async create() {
        return handleApiCall(() =>
            this.orderApi.create1()
                .then(res => res?.data)
        );
    }

    /**
     * Get payment intent for order
     */
    async paymentIntent(id: string) {
        return handleApiCall(() =>
            this.orderApi.paymentIntent({id: id})
                .then(res => res?.data)
        );
    }

    /**
     * Change existing orders status
     */
    async changeStatus(id: string, orderStatus: OrderStatusRequestOrderStatusEnum) {
        return handleApiCall(() =>
            this.orderApi.changeOrderStatus({id: id, orderStatusRequest: {orderStatus}})
                .then(res => res?.data)
        );
    }

    /**
     * Cancel an existing order
     */
    async cancel(id: string) {
        return handleApiCall(() =>
            this.orderApi.cancel({id})
                .then(res => res?.data)
        );
    }

    /**
     * return an existing order
     */
    async returnOrder(id: string) {
        return handleApiCall(() =>
            this.orderApi.returnOrder({id})
                .then(res => res?.data)
        );
    }

    /**
     * export orders
     */
    async export(from: string, to: string) {
        return handleApiCall(() =>
            this.orderApi.export1({from, to})
                .then(res => res?.data)
        );
    }

}

export const orderService = new OrderService();
