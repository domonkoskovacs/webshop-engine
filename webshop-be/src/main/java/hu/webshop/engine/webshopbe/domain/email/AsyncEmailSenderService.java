package hu.webshop.engine.webshopbe.domain.email;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.base.exception.GenericRuntimeException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.properties.EmailProperties;
import hu.webshop.engine.webshopbe.domain.email.value.Email;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AsyncEmailSenderService {

    private final JavaMailSender mailSender;
    private final EmailProperties emailProperties;

    @Async
    public void sendNoReplyMail(Email email) {
        if (emailProperties.isDemoMode()) {
            log.info("DEMO MODE: Skipping email to [{}]", email.to());
            return;
        }

        log.info("sendNoReplyMail > email to: [{}]", email.to());
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(email.to());
            helper.setFrom(emailProperties.getFrom());
            helper.setSubject(email.subject());
            helper.setText(email.body(), true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new GenericRuntimeException(ReasonCode.EMAIL_EXCEPTION, e.getMessage());
        }
    }
}
