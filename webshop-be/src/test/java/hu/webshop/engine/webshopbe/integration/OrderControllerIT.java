package hu.webshop.engine.webshopbe.integration;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderSortType;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.order.value.RefundOrderItem;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.user.repository.UserRepository;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.OrderStatusRequest;
import lombok.RequiredArgsConstructor;


@DisplayName("Order controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class OrderControllerIT extends IntegrationTest {
    private static final String USER_ID = "b7f86506-8ea8-4908-b8f4-668c5ec6a7ee";
    private static final String ORDER_ID = "11f86506-8ea8-4908-b8f4-668c5ec6a1e1";
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Test
    @DisplayName("user can place an order")
    @DataSet("userWithPlaceableOrder.yml")
    void userCanPlaceAnOrder() throws Exception {
        //Given //When
        ResultActions resultActions = performPost(ApiPaths.Orders.MY_BASE, Role.ROLE_USER);
        transaction();

        //Then
        resultActions.andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalPrice").value(18));
        awaitFor(() -> !orderRepository.findAll().isEmpty());
        awaitFor(() -> {
            Optional<User> byId = userRepository.findById(UUID.fromString(USER_ID));
            return byId.isPresent() && byId.get().getCart().isEmpty() && !byId.get().getOrders().get(0).getItems().isEmpty();
        });
    }

    @Test
    @DisplayName("admin can get all orders")
    @DataSet("existingOrderAndAdmin.yml")
    void adminCanGetAllOrders() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(ApiPaths.Orders.BASE, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.content").isArray()).andExpect(jsonPath("$.content").isNotEmpty());
    }

    @Test
    @DisplayName("admin can get all products with all params")
    @DataSet("existingOrderAndAdmin.yml")
    void adminCanGetAllProductsWithAllParams() throws Exception {
        //Given
        OrderSortType sortType = OrderSortType.ASC_PRICE;

        //When
        ResultActions resultActions = mockMvc.perform(get(ApiPaths.Orders.BASE)
                .param("minDate", "2023-01-09")
                .param("maxDate", "2023-12-09")
                .param("minPrice", "0.0")
                .param("maxPrice", "100.0")
                .param("paymentTypes", "STRIPE")
                .param("statuses", "CREATED")
                .param("sortType", sortType.name())
                .param("page", "0")
                .param("size", "10")
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, "Bearer " + getToken(Role.ROLE_ADMIN)));

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content").isNotEmpty());
    }

    @Test
    @DisplayName("all sort types work")
    @DataSet("existingOrderAndAdmin.yml")
    void allSortTypesWork() throws Exception {
        //Given //When //Then
        mockMvc.perform(get(ApiPaths.Orders.BASE)
                        .param("sortType", OrderSortType.ASC_PRICE.name())
                        .header(AUTHORIZATION, "Bearer " + getToken(Role.ROLE_ADMIN)))
                .andExpect(status().isOk());
        mockMvc.perform(get(ApiPaths.Orders.BASE)
                        .param("sortType", OrderSortType.DESC_PRICE.name())
                        .header(AUTHORIZATION, "Bearer " + getToken(Role.ROLE_ADMIN)))
                .andExpect(status().isOk());
        mockMvc.perform(get(ApiPaths.Orders.BASE)
                        .param("sortType", OrderSortType.ASC_ORDER_DATE.name())
                        .header(AUTHORIZATION, "Bearer " + getToken(Role.ROLE_ADMIN)))
                .andExpect(status().isOk());
        mockMvc.perform(get(ApiPaths.Orders.BASE)
                        .param("sortType", OrderSortType.DESC_ORDER_DATE.name())
                        .header(AUTHORIZATION, "Bearer " + getToken(Role.ROLE_ADMIN)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("not found order return 404")
    void notFoundOrderReturn404() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(pathWithId(ApiPaths.Orders.BY_ID, "/b7f86506-8ea8-4908-b8f4-668c5ec6a7e4"), Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("admin can change status")
    @DataSet("existingOrderAndAdmin.yml")
    void adminCanChangeStatus() throws Exception {
        //Given
        OrderStatusRequest orderStatusRequest = new OrderStatusRequest(OrderStatus.PAID);

        //When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Orders.CHANGE_STATUS, ORDER_ID), orderStatusRequest, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.status").value(OrderStatus.PAID.name()));
    }

    @Test
    @DisplayName("new status if not applicable results in an exception")
    @DataSet("existingOrderAndAdmin.yml")
    void newStatusIfNotApplicableResultsInAnException() throws Exception {
        //Given
        OrderStatusRequest orderStatusRequest = new OrderStatusRequest(OrderStatus.COMPLETED);

        //When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Orders.CHANGE_STATUS, ORDER_ID), orderStatusRequest, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("user can cancel the order")
    @DataSet("existingOrderAndAdmin.yml")
    void userCanCancelTheOrder() throws Exception {
        //Given //When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Orders.CANCEL, ORDER_ID), "", Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.status").value(OrderStatus.CANCELLED.name()));
    }

    @Test
    @DisplayName("orders can be exported")
    @DataSet("existingOrderAndAdmin.yml")
    void ordersCanBeExported() throws Exception {
        //Given
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("from", "2023-09-09");
        params.add("to", "2023-09-11");

        //When
        ResultActions resultActions = performGet(ApiPaths.Orders.EXPORT, Role.ROLE_ADMIN, params);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.csv")
                .value("T3JkZXJEYXRlO09yZGVyTnVtYmVyO1RvdGFsUHJpY2U7U2hpcHBpbmdQcmljZTtQYXltZW50TWV0aG9kO1N0YXR1cztQYXltZW50SW50ZW50SWQ7UmVmdW5kSWQ7UGFpZERhdGU7UmVmdW5kZWREYXRlO1VzZXJOYW1lO0l0ZW1Db3VudA0KMjAyMy0wOS0xMCAxOToyODoyNjtPUkRFUjE7MjAuMDs1LjA7U1RSSVBFO0NSRUFURUQ7Ozs7O3Rlc3QgdGVzdDsyDQo="));
    }

    @Test
    @DisplayName("user can initiate return")
    @DataSet("userWithReturnableOrder.yml")
    void userCanInitiateReturn() throws Exception {
        //Given //When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Orders.RETURN, ORDER_ID), Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.status").value(OrderStatus.RETURN_REQUESTED.toString()));
    }

    @Test
    @DisplayName("admins can create a refund for returned items")
    @DataSet("refundableOrderAndAdmin.yml")
    void adminsCanCreateARefundForReturnedItems() throws Exception {
        //Given
        List<RefundOrderItem> refundOrderItems = List.of(new RefundOrderItem(UUID.fromString("12f86506-8ea8-4908-b8f4-668c5ec6a1e2"), 1));

        //When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Orders.REFUND, ORDER_ID), refundOrderItems, Role.ROLE_ADMIN);
        transaction();

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(OrderStatus.RETURN_RECEIVED.toString()));
        awaitFor(() -> {
            Optional<Order> byId = orderRepository.findById(UUID.fromString(ORDER_ID));
            return byId.isPresent() && byId.get().getRefundId() != null;
        });
    }

    @Test
    @DisplayName("user can retrieve payment intent for order")
    @DataSet("userWithOrder.yml")
    void userCanRetrievePaymentIntentForOrder() throws Exception {
        //Given //When
        awaitFor(() -> {
            Optional<Order> byId = orderRepository.findById(UUID.fromString(ORDER_ID));
            return byId.isPresent() && byId.get().getPaymentIntentId() != null;
        });
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Orders.PAYMENT_INTENT, ORDER_ID), Role.ROLE_USER);
        transaction();

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.clientSecret").isNotEmpty());
        awaitFor(() -> {
            Optional<Order> byId = orderRepository.findById(UUID.fromString(ORDER_ID));
            return byId.isPresent() && byId.get().getPaymentIntentId() != null;
        });
    }

    @Test
    @DisplayName("user can create intent for order")
    @DataSet("userWithOrderWithoutPaymentIntent.yml")
    void userCanCreateIntentForOrder() throws Exception {
        //Given //When
        awaitFor(() -> {
            Optional<Order> byId = orderRepository.findById(UUID.fromString(ORDER_ID));
            return byId.isPresent() && byId.get().getPaymentIntentId() == null;
        });
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Orders.PAYMENT_INTENT, ORDER_ID), Role.ROLE_USER);
        transaction();

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.clientSecret").isNotEmpty());
        awaitFor(() -> {
            Optional<Order> byId = orderRepository.findById(UUID.fromString(ORDER_ID));
            return byId.isPresent() && byId.get().getPaymentIntentId() != null;
        });
    }

    @Test
    @DisplayName("user cannot retrieve paid intent")
    @DataSet("userWithPaidOrder.yml")
    void userCannotRetrievePaidIntent() throws Exception {
        //Given //When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Orders.PAYMENT_INTENT, ORDER_ID), Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("user can get its orders")
    @DataSet("userWithOrder.yml")
    void userCanGetItsOrders() throws Exception {
        //When
        ResultActions resultActions = performGet(ApiPaths.Orders.MY_BASE, Role.ROLE_USER);

        //Then
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$[0].totalPrice").value(20));
    }
}
