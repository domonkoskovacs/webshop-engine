package hu.webshop.engine.webshopbe.unit.domain.order;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.order.OrderQueryService;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderQueryService unit tests")
class OrderQueryServiceTest {

    @InjectMocks
    private OrderQueryService orderQueryService;
    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserService userService;

    @Test
    @DisplayName("getByIdForUpdate throws EntityNotFoundException when order not found")
    void getByIdForUpdateThrowsEntityNotFoundExceptionWhenOrderNotFound() {
        //Given
        UUID orderId = UUID.randomUUID();
        when(orderRepository.findByIdForUpdate(orderId)).thenReturn(Optional.empty());

        //When //Then
        assertThatThrownBy(() -> orderQueryService.getByIdForUpdate(orderId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Order was not found");
    }

}
