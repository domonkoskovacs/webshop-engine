import {OrderServiceApi, OrderServiceApiGetAll4Request, OrderStatusRequestOrderStatusEnum} from "../shared/api";
import {ApiBaseService} from "../shared/ApiBaseService";
import axiosInstance from "../lib/axios";

class OrderService extends ApiBaseService<OrderServiceApi> {
    constructor() {
        super(OrderServiceApi, axiosInstance);
    }

    /**
     * Get all orders by filters
     */
    async getAll(orderRequest: OrderServiceApiGetAll4Request) {
        return this.api.getAll4(orderRequest).then(res => res?.data)
    }

    /**
     * Get one order by id
     */
    async getById(id: string) {
        return this.api.getById1({id}).then(res => res?.data)
    }

    /**
     * Create a new order
     */
    async create() {
        return this.api.create1().then(res => res?.data)
    }

    /**
     * Get payment intent for order
     */
    async paymentIntent(id: string) {
        return this.api.paymentIntent({id: id}).then(res => res?.data)
    }

    /**
     * Change existing orders status
     */
    async changeStatus(id: string, orderStatus: OrderStatusRequestOrderStatusEnum) {
        return this.api.changeOrderStatus({id: id, orderStatusRequest: {orderStatus}}).then(res => res?.data)
    }

    /**
     * Cancel an existing order
     */
    async cancel(id: string) {
        return this.api.cancel({id}).then(res => res?.data)
    }

    /**
     * return an existing order
     */
    async returnOrder(id: string) {
        return this.api.returnOrder({id}).then(res => res?.data)
    }

    /**
     * export orders
     */
    async export(from: string, to: string) {
        return this.api.export1({from, to}).then(res => res?.data)
    }

}

export const orderService = new OrderService();
