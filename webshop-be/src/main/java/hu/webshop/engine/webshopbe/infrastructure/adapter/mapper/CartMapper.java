package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import hu.webshop.engine.webshopbe.domain.product.entity.Cart;
import hu.webshop.engine.webshopbe.domain.user.value.CartItem;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CartItemRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CartItemResponse;

@Mapper(uses = ProductMapper.class)
public interface CartMapper {

    CartItem fromRequest(CartItemRequest request);

    List<CartItem> fromRequestList(List<CartItemRequest> requests);

    CartItemResponse toResponse(Cart entity);

    List<CartItemResponse> toResponseList(List<Cart> entities);
}
