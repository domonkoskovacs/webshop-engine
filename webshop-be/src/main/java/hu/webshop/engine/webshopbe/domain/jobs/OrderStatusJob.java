package hu.webshop.engine.webshopbe.domain.jobs;

import java.time.OffsetDateTime;
import java.util.Arrays;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.order.OrderService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.repository.OrderRepository;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderStatusJob {

    private final StoreService storeService;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Scheduled(cron = "${application.schedule.unpaid-orders.cron}")
    @SchedulerLock(name = "autoCancelUnpaidOrders", lockAtMostFor = "50s", lockAtLeastFor = "30s")
    public void autoCancelUnpaidOrders() {
        OffsetDateTime cutoff = OffsetDateTime.now().minusHours(storeService.getStore().getUnpaidOrderCancelHours());
        orderRepository.findAllByStatusInAndOrderDateBefore(
                Arrays.asList(OrderStatus.CREATED, OrderStatus.PAYMENT_FAILED),
                cutoff).forEach(this::cancelOrder);
    }

    @Scheduled(cron = "${application.schedule.complete-orders.cron}")
    @SchedulerLock(name = "autoCompleteDeliveredOrders", lockAtMostFor = "50s", lockAtLeastFor = "30s")
    public void autoCompleteDeliveredOrders() {
        OffsetDateTime cutoff = OffsetDateTime.now().minusDays(storeService.getStore().getReturnPeriod());
        orderRepository.findAllByStatusAndOrderDateBefore(OrderStatus.DELIVERED, cutoff)
                .forEach(this::completeOrder);
    }

    private void cancelOrder(Order order) {
        try {
            orderService.cancel(order.getId());
        } catch (Exception e) {
            log.error("Error cancelling order {}: {}", order.getId(), e.getMessage());
        }
    }

    private void completeOrder(Order order) {
        try {
            orderService.changeStatus(order.getId(), OrderStatus.COMPLETED);
        } catch (Exception e) {
            log.error("Error finishing order {}: {}", order.getId(), e.getMessage());
        }
    }
}
