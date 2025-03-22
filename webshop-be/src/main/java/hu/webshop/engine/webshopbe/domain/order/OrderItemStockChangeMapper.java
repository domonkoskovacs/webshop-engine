package hu.webshop.engine.webshopbe.domain.order;

import java.util.List;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.product.value.StockChange;

@Mapper
public interface OrderItemStockChangeMapper {
    StockChange orderItemToStockChange(OrderItem orderItem);
    List<StockChange> orderItemsToStockChanges(List<OrderItem> orderItems);
}
