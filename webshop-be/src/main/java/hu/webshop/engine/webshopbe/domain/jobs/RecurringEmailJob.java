package hu.webshop.engine.webshopbe.domain.jobs;

import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.email.PromotionEmailService;
import hu.webshop.engine.webshopbe.domain.email.entity.PromotionEmail;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

@Slf4j
@Component
@RequiredArgsConstructor
public class RecurringEmailJob {

    private final UserService userService;
    private final PromotionEmailService promotionEmailService;
    private final StoreService storeService;

    /**
     * sends marketing emails, if it's enabled in store config,
     * only sends it to subscribed users
     * saves statistics
     */
    @Scheduled(cron = "${application.schedule.recurring-email.cron}")
    @SchedulerLock(name = "sendRecurringMarketingEmail", lockAtMostFor = "50s", lockAtLeastFor = "30s")
    public void sendRecurringMarketingEmail() {
       log.debug("sendRecurringMarketingEmail fired");
        if (Boolean.TRUE.equals(storeService.getStore().getEnableBuiltInMarketingEmails())) {
            userService.getSubscribedUsers().forEach(promotionEmailService::sendRecurringMarketingEmail);
            log.debug("sendRecurringMarketingEmail completed");
        }
    }

    /**
     * send created promotion emails,
     * runs every 30 min and send the emails on the correct period
     * an email can't be sent more than once a day
     */
    @Scheduled(cron = "${application.schedule.promotion-email.cron}")
    @SchedulerLock(name = "sendPromotionEmails", lockAtMostFor = "50s", lockAtLeastFor = "30s")
    public void sendPromotionEmails() {
        log.debug("sendPromotionEmails fired");
        List<PromotionEmail> promotionEmails = promotionEmailService.getAllPromotionEmail().stream().filter(PromotionEmail::needsToBeSent).toList();
        List<User> subscribedUsers = userService.getSubscribedUsers();
        promotionEmails.forEach(email -> subscribedUsers.forEach(user -> promotionEmailService.sendRecurringPromotionEmail(email, user)));
        log.debug("sendPromotionEmails completed");
    }
}
