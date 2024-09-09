package hu.webshop.engine.webshopbe.unit.domain.email;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import hu.webshop.engine.webshopbe.domain.base.exception.GenericRuntimeException;
import hu.webshop.engine.webshopbe.domain.email.AsyncEmailSenderService;
import hu.webshop.engine.webshopbe.domain.email.properties.EmailProperties;
import hu.webshop.engine.webshopbe.domain.email.value.Email;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@ExtendWith({MockitoExtension.class})
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("AsyncEmailSenderService unit tests")
class AsyncEmailSenderServiceTest {

    @InjectMocks
    private AsyncEmailSenderService asyncEmailSenderService;

    @Mock
    private JavaMailSender mailSender;
    @Mock
    private EmailProperties emailProperties;

    @Test
    @DisplayName("send no reply email catches error")
    void testSendNoReplyMailWithException() throws Exception {
        //Given
        Email email = new Email("not a valid email", "Test Subject", "Test Body");
        MimeMessage mockMimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mockMimeMessage);
        MimeMessageHelper mockHelper = mock(MimeMessageHelper.class);
        doThrow(new MessagingException("Simulated MessagingException")).when(mockHelper).setTo(Mockito.any(String.class));

        //When //Then
        assertThatThrownBy(() -> asyncEmailSenderService.sendNoReplyMail(email))
                .isInstanceOf(GenericRuntimeException.class);
    }
}
