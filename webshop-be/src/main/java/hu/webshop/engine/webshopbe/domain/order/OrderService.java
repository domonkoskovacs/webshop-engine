package hu.webshop.engine.webshopbe.domain.order;


import static hu.webshop.engine.webshopbe.domain.order.filters.OrderSpecification.getSpecifications;
import static hu.webshop.engine.webshopbe.domain.order.filters.OrderSpecification.getSpecificationsWithoutPrice;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.CREATED;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.PAID;
import static hu.webshop.engine.webshopbe.domain.util.CSVWriter.formatDate;
import static hu.webshop.engine.webshopbe.domain.util.CSVWriter.valueOfNullable;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.order.model.OrderPage;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.Currency;
import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSpecificationArgs;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Cart;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.value.StockChange;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.util.CSVWriter;
import hu.webshop.engine.webshopbe.domain.util.TimeUtil;
import hu.webshop.engine.webshopbe.domain.util.value.DateBetween;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final StripeService stripeService;
    private final ProductService productService;
    private final StoreService storeService;

    public OrderPage<Order> getAll(
            OrderSpecificationArgs args,
            PageRequest pageRequest
    ) {
        log.info("getAll > args: [{}], pageRequest: [{}]", args, pageRequest);
        Specification<Order> spec = getSpecifications(args);
        Page<Order> orders = orderRepository.findAll(spec, pageRequest);
        List<Order> ordersWithoutPriceFilter = orderRepository.findAll(getSpecificationsWithoutPrice(args));
        Double minPrice = ordersWithoutPriceFilter.stream().map(Order::getTotalPrice).min(Double::compareTo).orElse(0d);
        Double maxPrice = ordersWithoutPriceFilter.stream().map(Order::getTotalPrice).max(Double::compareTo).orElse(0d);
        return new OrderPage<>(orders.getContent(), pageRequest, orders.getTotalElements(), minPrice, maxPrice);
    }

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
        updateProductStock(saved, StockChange.DECREMENT);
        return saved;
    }

    private void updateProductStock(Order saved, StockChange stockChange) {
        saved.getItems().forEach(orderItem -> productService.updateStock(orderItem.getProductId(), orderItem.getCount(), stockChange));
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

    public PaymentIntent paymentIntent(UUID id) {
        log.info("createPaymentIntent > id: [{}]", id);
        Order order = getById(id);
        if (order.getStatus().equals(CREATED)) {
            PaymentIntent intent;
            if (order.getPaymentIntentId() == null) {
                intent = stripeService.createIntent(
                        new Intent(order.getTotalPrice(), Currency.USD, order.getUser().getEmail(), order.getId())
                );
                order.setPaymentIntentId(intent.getId());
                orderRepository.save(order);
            } else {
                intent = stripeService.retrieveIntent(order.getPaymentIntentId());
            }
            return intent;
        } else {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, "already paid");
        }
    }

    public Order getById(UUID id) {
        log.info("getById > id: [{}]", id);
        return orderRepository.findById(id).orElseThrow(this::entityNotFoundException);
    }

    private EntityNotFoundException entityNotFoundException() {
        return new EntityNotFoundException("Order was not found");
    }

    public Order changeStatus(UUID id, OrderStatus newStatus) {
        log.info("changeStatus > id: [{}], newStatus: [{}]", id, newStatus);
        Order order = getById(id);
        order.setStatus(newStatus);
        if (order.getStatus().shouldSendEmailNotification()) {
            emailService.sendOrderStatusChangedEmail(order);
        }
        if (order.getStatus().shouldUpdateStock()) {
            updateProductStock(order, StockChange.INCREMENT);
        }
        orderRepository.save(order);
        return order;
    }


    public Order cancel(UUID id) {
        log.info("cancel > id: [{}]", id);
        User currentUser = userService.getCurrentUser();
        Optional<Order> orderOpt = currentUser.getOrders().stream()
                .filter(o -> o.getId().equals(id))
                .findFirst();

        orderOpt.ifPresent(o -> {
            if (o.getStatus().isCancelable()) {
                if (OrderStatus.CREATED.equals(o.getStatus())) {
                    stripeService.cancelPaymentIntent(o.getPaymentIntentId());
                    o.setStatus(OrderStatus.CANCELLED);
                } else {
                    Refund refund = stripeService.createRefund(o.getPaymentIntentId(), o.getTotalPrice());
                    o.setRefundId(refund.getId());
                    o.setStatus(OrderStatus.WAITING_FOR_REFUND);
                }
                orderRepository.save(o);
                updateProductStock(o, StockChange.INCREMENT);
                emailService.sendOrderCanceledEmail(o);
            } else {
                throw new OrderException(ReasonCode.ORDER_EXCEPTION, "Can't cancel order, its status is: " + o.getStatus());
            }
        });

        return orderOpt.orElseThrow(() -> new OrderException(ReasonCode.ORDER_EXCEPTION, "No order present for the user with the given id"));
    }

    /**
     * exports orders as a csv within the given time period
     *
     * @return csv string
     */
    public String export(LocalDate from, LocalDate to) {
        log.info("export > from: [{}], to: [{}]", from, to);
        DateBetween dateBetween = TimeUtil.validateAndSetDateBetween(from, to);
        List<Order> exportData = getAllBetween(dateBetween.from(), dateBetween.to());
        String[] header = {"OrderDate", "totalPrice", "paymentMethod", "status", "userName", "productCount"};
        List<Function<Order, ?>> columnExtractors = List.of(
                order -> formatDate(order.getOrderDate()),
                Order::getTotalPrice,
                order -> valueOfNullable(order.getPaymentMethod(), PaymentMethod::name),
                order -> valueOfNullable(order.getStatus(), OrderStatus::name),
                order -> valueOfNullable(order.getUser(), User::getFullName),
                order -> valueOfNullable(order.getItems(), List::size)
        );
        return new CSVWriter<>(
                exportData,
                header,
                columnExtractors
        ).base64().asString();
    }

    public List<Order> getAllBetween(LocalDate from, LocalDate to) {
        return orderRepository.findAllByOrderDateGreaterThanEqualAndOrderDateLessThan(
                OffsetDateTime.of(from, LocalTime.MIDNIGHT, ZoneOffset.UTC),
                OffsetDateTime.of(to, LocalTime.MIDNIGHT, ZoneOffset.UTC)
        );
    }

    public void paymentIntentSucceeded(PaymentIntent paymentIntent) {
        Optional<Order> orderByPaymentIntentId = orderRepository.findByPaymentIntentId(paymentIntent.getId());
        orderByPaymentIntentId.ifPresent(order -> {
            if ((CREATED.equals(order.getStatus()) || OrderStatus.PAYMENT_FAILED.equals(order.getStatus())) && order.getPaidDate() == null) {
                order.setStatus(PAID);
                order.setPaidDate(OffsetDateTime.now());
            }
            orderRepository.save(order);
        });
    }

    public void paymentIntentFailed(PaymentIntent paymentIntent) {
        Optional<Order> orderByPaymentIntentId = orderRepository.findByPaymentIntentId(paymentIntent.getId());
        orderByPaymentIntentId.ifPresent(order -> {
            if (CREATED.equals(order.getStatus())) {
                order.setStatus(OrderStatus.PAYMENT_FAILED);
            }
            orderRepository.save(order);
        });
    }

    public void handleRefundSuccess(Refund refund) {
        Optional<Order> orderOpt = orderRepository.findByRefundId(refund.getId());
        orderOpt.ifPresent(order -> {
            if (order.getRefundedDate() == null) {
                if (order.getStatus() == OrderStatus.WAITING_FOR_REFUND) {
                    order.setStatus(OrderStatus.REFUNDED);
                } else if (order.getStatus() == OrderStatus.RETURN_RECEIVED) {
                    order.setStatus(OrderStatus.RETURN_COMPLETED);
                }
                order.setRefundedDate(OffsetDateTime.now());
                orderRepository.save(order);
            }
        });
    }

}
