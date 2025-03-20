package hu.webshop.engine.webshopbe.unit.domain.email;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.thymeleaf.spring6.ISpringTemplateEngine;

import hu.webshop.engine.webshopbe.domain.email.AsyncEmailSenderService;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.email.properties.EmailProperties;
import hu.webshop.engine.webshopbe.domain.email.value.Email;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.user.entity.User;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmailService unit tests")
class EmailServiceTest {
    @InjectMocks
    private EmailService emailService;
    @Mock
    private EmailProperties emailProperties;
    @Mock
    private ISpringTemplateEngine templateEngine;
    @Mock
    private AsyncEmailSenderService emailSender;

    @Test
    @DisplayName("send reoccurring email")
    void testSendRecurringMarketingEmail() {
        //Given
        User user = User.builder()
                .firstname("first")
                .lastname("last")
                .email("email@email.com")
                .saved(List.of(Product.builder().discountPercentage(10.0).imageUrls("url").build()))
                .build();
        user.setId(UUID.randomUUID());
        when(emailProperties.getUnsubscribe()).thenReturn("url");

        //When
        emailService.sendRecurringMarketingEmail(user);

        //Then
        verify(emailSender, times(1)).sendNoReplyMail(any(Email.class));
    }
}
