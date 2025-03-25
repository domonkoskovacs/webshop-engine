package hu.webshop.engine.webshopbe.domain.order.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.product.value.StockChange;

@Mapper
public interface OrderItemStockChangeMapper {
    StockChange orderItemToStockChange(OrderItem orderItem);
    List<StockChange> orderItemsToStockChanges(List<OrderItem> orderItems);
    default List<StockChange> orderItemsToReturnedStockChanges(List<OrderItem> orderItems) {
        return orderItems.stream()
                .filter(item -> item.getReturnedCount() != null && item.getReturnedCount() > 0)
                .map(item -> new StockChange(item.getProductId(), item.getReturnedCount()))
                .toList();
    }
}
