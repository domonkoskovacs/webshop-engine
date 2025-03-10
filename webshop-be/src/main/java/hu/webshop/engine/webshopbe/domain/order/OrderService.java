package hu.webshop.engine.webshopbe.domain.order;


import static hu.webshop.engine.webshopbe.domain.order.filters.OrderSorting.sort;
import static hu.webshop.engine.webshopbe.domain.order.filters.OrderSpecification.getSpecifications;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.CANCELLED;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.CREATED;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.FINISHED;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.PACKAGED;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.PAYED;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.SHIPPING;
import static hu.webshop.engine.webshopbe.domain.order.value.OrderStatus.WAITING_FOR_REFUND;
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
import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.Currency;
import hu.webshop.engine.webshopbe.domain.order.value.Intent;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSortType;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSpecificationArgs;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Cart;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.value.StockChange;
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

    public Page<Order> getAll(
            OrderSpecificationArgs args,
            OrderSortType sortType,
            int page,
            int size
    ) {
        log.info("getAll > args: [{}], sortType: [{}], page: [{}], size: [{}]", args, sortType, page, size);
        Specification<Order> spec = getSpecifications(args);
        if (sortType != null) return orderRepository.findAll(spec, PageRequest.of(page, size, sort(sortType)));
        else return orderRepository.findAll(spec, PageRequest.of(page, size));
    }

    public Order create(PaymentMethod paymentMethod) {
        log.info("create > paymentMethod: [{}]", paymentMethod);
        User currentUser = userService.getCurrentUser();
        validateOrderCanStart(currentUser);
        List<OrderItem> products = mapUserCartToOrderItems(currentUser);
        Double totalPrice = calculateOrderItemsTotalPrice(products);
        Order order = Order.builder()
                .orderDate(OffsetDateTime.now())
                .totalPrice(totalPrice)
                .paymentMethod(paymentMethod)
                .status(CREATED)
                .user(currentUser)
                .products(products)
                .build();
        userService.clearCart();
        Order saved = orderRepository.save(order);
        emailService.sendOrderCreatedEmail(saved);
        updateProductStock(saved, StockChange.DECREMENT);
        return saved;
    }

    private void updateProductStock(Order saved, StockChange stockChange) {
        saved.getProducts().forEach(orderItem -> productService.updateStock(orderItem.getProduct().getId(), orderItem.getCount(), stockChange));
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
                .map(orderItem -> orderItem.getProduct().getPrice() * orderItem.getCount())
                .reduce(Double::sum)
                .orElse(0.0);
    }

    private static List<OrderItem> mapUserCartToOrderItems(User currentUser) {
        return currentUser.getCart().stream()
                .map(cartItem ->
                        OrderItem.builder().product(cartItem.getProduct()).count(cartItem.getCount()).build()
                ).toList();
    }

    public PaymentIntent createPaymentIntent(UUID id) {
        log.info("createPaymentIntent > id: [{}]", id);
        Order order = getById(id);
        if (order.getStatus().equals(CREATED)) {
            PaymentIntent intent = stripeService.intent(new Intent(order.getTotalPrice(), Currency.USD, order.getUser().getEmail(), order.getId()));
            order.setPaymentIntentId(intent.getId());
            orderRepository.save(order);
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

    public Order changeStatus(UUID id, OrderStatus orderStatus) {
        log.info("changeStatus > id: [{}], orderStatus: [{}]", id, orderStatus);
        Order order = getById(id);
        if (isNewStatusApplicable(order.getStatus(), orderStatus)) {
            order.setStatus(orderStatus);
            emailService.sendOrderStatusChangedEmail(order);
            if (WAITING_FOR_REFUND.equals(orderStatus)) {
                updateProductStock(order, StockChange.INCREMENT);
            }
            return order;
        } else {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, orderStatus + "is not applicable to status: " + order.getStatus());
        }
    }

    private boolean isNewStatusApplicable(OrderStatus old, OrderStatus newStatus) {
        return switch (old) {
            case CREATED -> newStatus.equals(PAYED) || newStatus.equals(WAITING_FOR_REFUND);
            case PAYED -> newStatus.equals(PACKAGED) || newStatus.equals(WAITING_FOR_REFUND);
            case PACKAGED -> newStatus.equals(SHIPPING) || newStatus.equals(WAITING_FOR_REFUND);
            case SHIPPING -> newStatus.equals(FINISHED);
            case FINISHED, CANCELLED -> false;
            case WAITING_FOR_REFUND -> newStatus.equals(CANCELLED);
        };
    }

    public Order cancel(UUID id) {
        log.info("cancel > id: [{}]", id);
        User currentUser = userService.getCurrentUser();
        Optional<Order> order = currentUser.getOrders().stream().filter(o -> o.getId().equals(id)).findFirst();
        order.ifPresent(o -> {
                    if (OrderStatus.isCancelable(o.getStatus())) {
                        emailService.sendOrderCanceledEmail(o);
                        o.setStatus(WAITING_FOR_REFUND);
                        orderRepository.save(o);
                        updateProductStock(o, StockChange.INCREMENT);
                    } else {
                        throw new OrderException(ReasonCode.ORDER_EXCEPTION, "Can't cancel order, its status is: " + o.getStatus());
                    }
                }
        );
        if (order.isPresent()) {
            return order.get();
        } else {
            throw new OrderException(ReasonCode.ORDER_EXCEPTION, "No order present for the user with the given id");
        }
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
                order -> valueOfNullable(order.getProducts(), List::size)
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
}
