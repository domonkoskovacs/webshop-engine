package hu.webshop.engine.webshopbe.domain.jobs;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.image.ImageCleanUpService;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;


@Slf4j
@Component
@RequiredArgsConstructor
public class UnusedImagesJob {

    private final StoreService storeService;
    private final ImageCleanUpService imageCleanUpService;

    /**
     * Deletes unused images if this job is enabled in the store configuration.
     * This job runs as per the configured cron expression (typically every midnight).
     */
    @Scheduled(cron = "${application.schedule.unused-images.cron}")
    @SchedulerLock(name = "deleteUnusedImages", lockAtMostFor = "50s", lockAtLeastFor = "30s")
    public void deleteUnusedImages() {
        log.info("UnusedImagesJob started");
        boolean deleteEnabled = Boolean.TRUE.equals(storeService.getStore().getDeleteUnusedPictures());
        if (deleteEnabled) {
            imageCleanUpService.deleteUnusedImages();
        }
        log.info("UnusedImagesJob completed");
    }
}
