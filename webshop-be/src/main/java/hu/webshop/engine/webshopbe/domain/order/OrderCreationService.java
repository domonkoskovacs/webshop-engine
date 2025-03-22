package hu.webshop.engine.webshopbe.domain.order;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.order.mapper.OrderItemStockChangeMapper;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Cart;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.value.StockChangeType;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderCreationService {

    private final OrderRepository orderRepository;
    private final OrderItemStockChangeMapper orderItemStockChangeMapper;
    private final UserService userService;
    private final EmailService emailService;
    private final ProductService productService;
    private final StoreService storeService;

    public Order create(PaymentMethod paymentMethod) {
        log.info("create > paymentMethod: [{}]", paymentMethod);
        User currentUser = userService.getCurrentUser();
        validateOrderCanStart(currentUser);
        List<OrderItem> orderItems = mapUserCartToOrderItems(currentUser);
        Double totalPrice = calculateOrderItemsTotalPrice(orderItems) + storeService.getStore().getShippingPrice();
        Order order = Order.builder()
                .totalPrice(totalPrice)
                .shippingPrice(storeService.getStore().getShippingPrice())
                .paymentMethod(paymentMethod)
                .user(currentUser)
                .items(orderItems)
                .build();
        userService.clearCart();
        Order saved = orderRepository.save(order);
        emailService.sendOrderCreatedEmail(saved);
        productService.updateStock(
                orderItemStockChangeMapper.orderItemsToStockChanges(saved.getItems()),
                StockChangeType.DECREMENT);
        return saved;
    }

    private void validateOrderCanStart(User currentUser) {
        if (currentUser.getShippingAddress() == null)
            throw new OrderException(ReasonCode.NO_SHIPPING_ADDRESS, "User doesnt have a shipping address");
        if (currentUser.getBillingAddress() == null)
            throw new OrderException(ReasonCode.NO_BILLING_ADDRESS, "User doesnt have a billing address");
        if (currentUser.getCart().isEmpty())
            throw new OrderException(ReasonCode.NO_ITEMS_IN_CART, "User doesnt have any item in cart");
        if (isThereInvalidProducts(currentUser.getCart()))
            throw new OrderException(ReasonCode.NOT_ENOUGH_PRODUCT_IN_STOCK, "There isn't enough product to complete the order");
        if (calculateOrderItemsTotalPrice(mapUserCartToOrderItems(currentUser)) < storeService.getStore().getMinOrderPrice()) {
            throw new OrderException(ReasonCode.INVALID_ORDER_PRICE, "Order price is too low");
        }
    }

    private boolean isThereInvalidProducts(List<Cart> cart) {
        log.info("isThereInvalidProducts > cart: [{}]", cart);
        return cart.stream().anyMatch(cartItem -> {
            Product product = productService.getById(cartItem.getProduct().getId());
            return product.getCount() < cartItem.getCount();
        });
    }

    private static Double calculateOrderItemsTotalPrice(List<OrderItem> products) {
        return products.stream()
                .map(orderItem -> orderItem.getIndividualPrice() * orderItem.getCount())
                .reduce(Double::sum)
                .orElse(0.0);
    }

    private static List<OrderItem> mapUserCartToOrderItems(User currentUser) {
        return currentUser.getCart().stream()
                .map(cartItem ->
                        OrderItem.builder().productName(cartItem.getProduct().getName())
                                .individualPrice(cartItem.getProduct().getPrice() * (1 - cartItem.getProduct().getDiscountPercentage() / 100))
                                .thumbNailUrl(cartItem.getProduct().getThumbNailUrl())
                                .gender(cartItem.getProduct().getGender())
                                .categoryName(cartItem.getProduct().getSubCategory().getCategory().getName())
                                .subcategoryName(cartItem.getProduct().getSubCategory().getName())
                                .productId(cartItem.getProduct().getId())
                                .count(cartItem.getCount()).build()
                ).toList();
    }
}
