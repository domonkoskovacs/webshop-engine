package hu.webshop.engine.webshopbe.domain.jobs;

import java.time.OffsetDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.order.OrderStatusService;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderStatusJob {

    private final StoreService storeService;
    private final OrderStatusService orderStatusService;

    @Scheduled(cron = "${application.schedule.unpaid-orders.cron}")
    @SchedulerLock(name = "autoCancelUnpaidOrders", lockAtMostFor = "50s", lockAtLeastFor = "30s")
    public void autoCancelUnpaidOrders() {
        log.debug("autoCancelUnpaidOrders fired");
        OffsetDateTime cutoff = OffsetDateTime.now().minusHours(storeService.getStore().getUnpaidOrderCancelHours());
        orderStatusService.autoCancelUnpaidOrders(cutoff);
        log.debug("autoCancelUnpaidOrders completed");
    }

    @Scheduled(cron = "${application.schedule.complete-orders.cron}")
    @SchedulerLock(name = "autoCompleteDeliveredOrders", lockAtMostFor = "50s", lockAtLeastFor = "30s")
    public void autoCompleteDeliveredOrders() {
        log.debug("autoCompleteDeliveredOrders fired");
        OffsetDateTime cutoff = OffsetDateTime.now().minusDays(storeService.getStore().getReturnPeriod());
        orderStatusService.autoCompleteDeliveredOrders(cutoff);
        log.debug("autoCompleteDeliveredOrders completed");
    }
}
