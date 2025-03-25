package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.base.exception.OrderException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.order.OrderCreationService;
import hu.webshop.engine.webshopbe.domain.order.mapper.OrderItemStockChangeMapper;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.PaymentMethod;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Cart;
import hu.webshop.engine.webshopbe.domain.product.entity.Category;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.product.entity.SubCategory;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.store.entity.Store;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.Address;
import hu.webshop.engine.webshopbe.domain.user.entity.User;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderCreationService unit tests")
class OrderCreationServiceTest {

    @InjectMocks
    private OrderCreationService orderCreationService;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private OrderItemStockChangeMapper orderItemStockChangeMapper;
    @Mock
    private UserService userService;
    @Mock
    private EmailService emailService;
    @Mock
    private ProductService productService;
    @Mock
    private StoreService storeService;

    @Test
    @DisplayName("validate catches shipping address is null")
    void validateCatchesShippingAddressIsNull() {
        //Given
        when(userService.getCurrentUser()).thenReturn(User.builder().shippingAddress(null).billingAddress(new Address()).cart(List.of(new Cart())).build());

        //When //Then
        assertThatThrownBy(() -> orderCreationService.create(PaymentMethod.STRIPE))
                .isInstanceOf(OrderException.class)
                .extracting(e -> ((OrderException) e).getResponse().error().get(0).reasonCode())
                .isEqualTo(ReasonCode.NO_SHIPPING_ADDRESS);
    }

    @Test
    @DisplayName("validate catches billing address is null")
    void validateCatchesBillingAddressIsNull() {
        //Given
        when(userService.getCurrentUser()).thenReturn(User.builder().shippingAddress(new Address()).billingAddress(null).cart(List.of(new Cart())).build());

        //When //Then
        assertThatThrownBy(() -> orderCreationService.create(PaymentMethod.STRIPE))
                .isInstanceOf(OrderException.class)
                .extracting(e -> ((OrderException) e).getResponse().error().get(0).reasonCode())
                .isEqualTo(ReasonCode.NO_BILLING_ADDRESS);
    }

    @Test
    @DisplayName("validate catches cart is empty")
    void validateCatchesCartIsEmpty() {
        //Given
        when(userService.getCurrentUser()).thenReturn(User.builder().shippingAddress(new Address()).billingAddress(new Address()).cart(List.of()).build());

        //When //Then
        assertThatThrownBy(() -> orderCreationService.create(PaymentMethod.STRIPE))
                .isInstanceOf(OrderException.class)
                .extracting(e -> ((OrderException) e).getResponse().error().get(0).reasonCode())
                .isEqualTo(ReasonCode.NO_ITEMS_IN_CART);
    }

    @Test
    @DisplayName("validate catches insufficient stock")
    void validateCatchesInsufficientStock() {
        //Given
        Product product = Product.builder().count(10).build();
        Cart cart = Cart.builder().product(product).count(11).build();
        User user = User.builder().shippingAddress(new Address()).billingAddress(new Address()).cart(List.of(cart)).build();
        when(userService.getCurrentUser()).thenReturn(user);

        //When //Then
        assertThatThrownBy(() -> orderCreationService.create(PaymentMethod.STRIPE))
                .isInstanceOf(OrderException.class)
                .extracting(e -> ((OrderException) e).getResponse().error().get(0).reasonCode())
                .isEqualTo(ReasonCode.NOT_ENOUGH_PRODUCT_IN_STOCK);
    }

    @Test
    @DisplayName("validate catches if total price is below min order")
    void validateCatchesIfTotalPriceIsBelowMinOrder() {
        //Given
        Store store = Store.builder().minOrderPrice(50.0).build();
        Product product = Product.builder().discountPercentage(0.0).subCategory(SubCategory.builder().category(new Category()).build()).count(10).price(10.0).build();
        Cart cart = Cart.builder().product(product).count(1).build();
        User user = User.builder().shippingAddress(new Address()).billingAddress(new Address()).cart(List.of(cart)).build();
        when(userService.getCurrentUser()).thenReturn(user);
        when(storeService.getStore()).thenReturn(store);
        //When //Then
        assertThatThrownBy(() -> orderCreationService.create(PaymentMethod.STRIPE))
                .isInstanceOf(OrderException.class)
                .extracting(e -> ((OrderException) e).getResponse().error().get(0).reasonCode())
                .isEqualTo(ReasonCode.INVALID_ORDER_PRICE);
    }
}
