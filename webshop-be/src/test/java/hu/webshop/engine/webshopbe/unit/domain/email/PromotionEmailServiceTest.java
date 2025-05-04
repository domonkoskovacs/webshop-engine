package hu.webshop.engine.webshopbe.unit.domain.email;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.email.PromotionEmailService;
import hu.webshop.engine.webshopbe.domain.email.entity.PromotionEmail;
import hu.webshop.engine.webshopbe.domain.email.repository.PromotionEmailRepository;
import hu.webshop.engine.webshopbe.domain.image.entity.ImageMetadata;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.user.entity.User;

@ExtendWith(MockitoExtension.class)
@DisplayName("PromotionEmailService unit tests")
class PromotionEmailServiceTest {
    @InjectMocks
    private PromotionEmailService promotionEmailService;
    @Mock
    private PromotionEmailRepository promotionalEmailRepository;
    @Mock
    private EmailService emailService;

    @Test
    @DisplayName("send recurring promotion email")
    void sendRecurringPromotionEmail() {
        //Given
        User user = User.builder().build();
        PromotionEmail promotionEmail = PromotionEmail.builder().build();

        //When
        promotionEmailService.sendRecurringPromotionEmail(promotionEmail, user);

        //Then
        verify(emailService, times(1)).sendPromotionEmail(any(PromotionEmail.class), any(User.class));

    }

    @Test
    @DisplayName("promotion email does not rethrows error")
    void promotionEmailDoesNotRethrowsError() {
        //Given
        User user = User.builder().build();
        PromotionEmail promotionEmail = PromotionEmail.builder().build();
        doThrow(new RuntimeException("Simulated exception")).when(emailService).sendPromotionEmail(promotionEmail, user);

        //When
        assertThatCode(() -> promotionEmailService.sendRecurringPromotionEmail(promotionEmail, user)).doesNotThrowAnyException();

        //Then
        verify(emailService, times(1)).sendPromotionEmail(promotionEmail, user);
    }

    @Test
    @DisplayName("send recurring email")
    void testSendRecurringMarketingEmail() {
        //Given
        Product product = Product.builder()
                .discountPercentage(10.0)
                .images(List.of(
                        ImageMetadata.builder()
                                .url("url")
                                .build()
                ))
                .build();
        User user = User.builder()
                .firstname("first")
                .lastname("last")
                .email("email@email.com")
                .saved(List.of(product))
                .build();
        user.setId(UUID.randomUUID());

        //When
        promotionEmailService.sendRecurringMarketingEmail(user);

        //Then
        verify(emailService, times(1)).sendMarketingEmail(any(User.class), any(Product.class));
    }

    @Test
    @DisplayName("send recurring email catches exception")
    void sendRecurringEmailCatchesException() {
        //Given
        User user = spy(User.builder().build());
        doThrow(new RuntimeException("Exception")).when(user).getMostDiscontedSavedProduct();

        //When
        promotionEmailService.sendRecurringMarketingEmail(user);

        //Then
        verify(emailService, times(0)).sendMarketingEmail(any(User.class), any(Product.class));
    }
}
