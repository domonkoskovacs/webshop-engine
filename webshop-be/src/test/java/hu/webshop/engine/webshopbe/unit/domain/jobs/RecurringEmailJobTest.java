package hu.webshop.engine.webshopbe.unit.domain.jobs;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.email.entity.PromotionEmail;
import hu.webshop.engine.webshopbe.domain.jobs.RecurringEmailJob;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.store.entity.Store;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.User;

@ExtendWith(MockitoExtension.class)
@DisplayName("RecurringEmailJob unit tests")
class RecurringEmailJobTest {

    @InjectMocks
    private RecurringEmailJob recurringEmailJob;
    @Mock
    private UserService userService;
    @Mock
    private EmailService emailService;
    @Mock
    private StoreService storeService;

    @Test
    @DisplayName("verify that send recurring marketing emails called and stats saved")
    void verifyThatSendRecurringMarketingEmailsCalledAndStatsSaved() {
        //Given
        when(userService.getSubscribedUsers()).thenReturn(List.of(User.builder().build(), User.builder().build()));
        when(storeService.getStore()).thenReturn(Store.builder().enableBuiltInMarketingEmails(true).build());

        //When
        recurringEmailJob.sendRecurringMarketingEmail();

        //Then
        verify(emailService, times(2)).sendRecurringMarketingEmail(any(User.class));
    }

    @Test
    @DisplayName("no emails sent if user if no user subscribed")
    void noEmailsSentIfUserIfNoUserSubscribed() {
        //Given
        when(userService.getSubscribedUsers()).thenReturn(List.of());
        when(storeService.getStore()).thenReturn(Store.builder().enableBuiltInMarketingEmails(true).build());

        //When
        recurringEmailJob.sendRecurringMarketingEmail();

        //Then
        verify(emailService, times(0)).sendRecurringMarketingEmail(any(User.class));
    }

    @Test
    @DisplayName("emails not sent if store config do not enables marketing emails")
    void emailsNotSentIfStoreConfigDoNotEnablesMarketingEmails() {
        //Given
        when(storeService.getStore()).thenReturn(Store.builder().enableBuiltInMarketingEmails(false).build());

        //When
        recurringEmailJob.sendRecurringMarketingEmail();

        //Then
        verify(emailService, times(0)).sendRecurringMarketingEmail(any(User.class));
    }

    @Test
    @DisplayName("verify promotion emails are sent")
    void verifyPromotionEmailsAreSent() {
        //Given
        OffsetDateTime now = OffsetDateTime.now();
        PromotionEmail email = PromotionEmail.builder()
                .name("name")
                .dayOfWeek(now.getDayOfWeek().name())
                .hour(now.getHour())
                .minute(now.getMinute()).build();
        when(userService.getSubscribedUsers()).thenReturn(List.of(User.builder().build(), User.builder().build()));
        when(emailService.getAllPromotionEmail()).thenReturn(List.of(email));

        //When
        recurringEmailJob.sendPromotionEmails();

        //Then
        verify(emailService, times(2)).sendRecurringPromotionEmail(any(PromotionEmail.class), any(User.class));
    }

    @Test
    @DisplayName("if no email created nothing called")
    void ifNoEmailCreatedNothingCalled() {
        //Given
        when(userService.getSubscribedUsers()).thenReturn(List.of(User.builder().build(), User.builder().build()));
        when(emailService.getAllPromotionEmail()).thenReturn(List.of());

        //When
        recurringEmailJob.sendPromotionEmails();

        //Then
        verify(emailService, times(0)).sendRecurringPromotionEmail(any(PromotionEmail.class), any(User.class));
    }
}
