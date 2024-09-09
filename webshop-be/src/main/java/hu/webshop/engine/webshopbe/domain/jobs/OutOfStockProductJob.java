package hu.webshop.engine.webshopbe.domain.jobs;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

@Slf4j
@Component
@RequiredArgsConstructor
public class OutOfStockProductJob {

    private final ProductService productService;
    private final StoreService storeService;

    /**
     * deletes out of stock products if this job is enabled in store config and
     * only try's to delete older than 30 days products
     * runs every midnight by default
     */
    @Scheduled(cron = "${application.schedule.out-of-stock-product.cron}")
    @SchedulerLock(name = "deleteOutOfStockProducts", lockAtMostFor = "50s", lockAtLeastFor = "30s")
    public void deleteOutOfStockProducts() {
        log.debug("deleting out of stocks job started");
        int daysBefore = 30;
        if (Boolean.TRUE.equals(storeService.getStore().getDeleteOutOfStockProducts())) {
            productService.deleteAllByStockAndDate(0,
                    OffsetDateTime.of(LocalDate.now().minusDays(daysBefore), LocalTime.MIDNIGHT, ZoneOffset.UTC));
            log.debug("out of stock products were deleted before [{}] days", daysBefore);
        }
    }
}
