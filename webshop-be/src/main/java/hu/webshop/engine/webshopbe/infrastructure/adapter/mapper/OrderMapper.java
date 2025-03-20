package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.value.RefundOrderItem;
import hu.webshop.engine.webshopbe.infrastructure.model.request.RefundOrderItemRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.OrderResponse;

@Mapper(uses = {AddressMapper.class, OrderItemMapper.class})
public interface OrderMapper {

    @Mapping(target = "phoneNumber", source = "user.phoneNumber")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "address", source = "user.shippingAddress")
    @Mapping(target = "billingAddress", source = "user.billingAddress")
    OrderResponse toResponse(Order entity);

    List<OrderResponse> toResponseList(List<Order> entities);
    RefundOrderItem fromRequest(RefundOrderItemRequest refundOrderItemRequest);
    List<RefundOrderItem> fromRequestlist(List<RefundOrderItemRequest> refundOrderItemRequest);
}
