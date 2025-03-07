package hu.webshop.engine.webshopbe.domain.email;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.ISpringTemplateEngine;

import hu.webshop.engine.webshopbe.domain.base.exception.EmailException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.entity.EmailStat;
import hu.webshop.engine.webshopbe.domain.email.entity.PromotionEmail;
import hu.webshop.engine.webshopbe.domain.email.properties.EmailProperties;
import hu.webshop.engine.webshopbe.domain.email.repository.EmailStatRepository;
import hu.webshop.engine.webshopbe.domain.email.repository.PromotionalEmailRepository;
import hu.webshop.engine.webshopbe.domain.email.value.Email;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.util.Constants;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class EmailService {

    private static final String FULL_NAME = "fullName";
    private static final String PRODUCTS = "products";
    private final EmailProperties emailProperties;
    private final ISpringTemplateEngine templateEngine;
    private final AsyncEmailSenderService emailSender;
    private final EmailStatRepository emailStatRepository;
    private final PromotionalEmailRepository promotionalEmailRepository;

    public void sendForgottenPasswordEmail(String to, UUID id) {
        log.info("sendForgottenPasswordEmail > to: [{}], id: [{}]", to, id);
        Map<String, Object> variables = Map.of(
                "url", emailProperties.getNewPassword().replace("{id}", id.toString())
        );
        String body = createEmailBody("forgotten-password.html", variables);
        Email email = new Email(to, "Forgotten password", body);
        emailSender.sendNoReplyMail(email);
    }

    public String createEmailBody(String templateName, Map<String, Object> variables) {
        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(variables);
        return templateEngine.process(templateName, thymeleafContext);
    }

    public void sendRegistrationMail(User user) {
        log.info("sendRegistrationMail > user: [{}]", user);
        Map<String, Object> variables = Map.of(
                FULL_NAME, user.getFullName(),
                "url", emailProperties.getVerify().replace("{id}", user.getId().toString())
        );
        String body = createEmailBody("registration.html", variables);
        Email email = new Email(user.getEmail(), "Registration", body);
        emailSender.sendNoReplyMail(email);
    }

    public void sendOrderCreatedEmail(Order order) {
        log.info("sendOrderCreatedEmail > order: [{}]", order);
        Map<String, Object> variables = Map.of(
                FULL_NAME, order.getUser().getFullName(),
                PRODUCTS, order.getProductDetails(),
                "moreInfoUrl", emailProperties.getMoreInfo().replace("{id}", order.getId().toString())
        );
        String body = createEmailBody("new-order.html", variables);
        Email email = new Email(order.getUser().getEmail(), "New order", body);
        emailSender.sendNoReplyMail(email);
    }

    public void sendOrderStatusChangedEmail(Order order) {
        log.info("sendOrderStatusChangedEmail > order: [{}]", order);
        Map<String, Object> variables = Map.ofEntries(
                Map.entry(FULL_NAME, order.getUser().getFullName()),
                Map.entry(PRODUCTS, order.getProductDetails()),
                Map.entry("newOrderStatus", order.getStatus().name().toLowerCase()),
                Map.entry("moreInfoUrl", emailProperties.getMoreInfo().replace("{id}", order.getId().toString()))
        );
        String body = createEmailBody("order-status-changed.html", variables);
        Email email = new Email(order.getUser().getEmail(), "Order status changed", body);
        emailSender.sendNoReplyMail(email);
    }

    public void sendOrderCanceledEmail(Order order) {
        log.info("sendOrderCanceledEmail");
        Map<String, Object> variables = Map.of(
                FULL_NAME, order.getUser().getFullName(),
                PRODUCTS, order.getProductDetails()
        );
        String body = createEmailBody("order-cancelled.html", variables);
        Email email = new Email(order.getUser().getEmail(), "Order cancelled", body);
        emailSender.sendNoReplyMail(email);
    }

    /**
     * sends a recurring email, but catches every error in order complete the majority of the job
     */
    public boolean sendRecurringMarketingEmail(User user) {
        try {
            Product product = user.getMostDiscontedSavedProduct();
            if (product != null) {
                sendMarketingEmail(user, product);
                return true;
            }
            return false;
        } catch (Exception e) {
            log.error("error during sending recurring email", e);
            return false;
        }
    }

    private void sendMarketingEmail(User user, Product product) {
        Map<String, Object> variables = Map.of(
                FULL_NAME, user.getFullName(),
                "product", product,
                "unsubscribeUrl", emailProperties.getUnsubscribe().replace("{id}", user.getId().toString()),
                "productImageUrl", Arrays.stream(product.getImageUrls().split(Constants.IMAGE_URL_SEPARATOR)).findFirst().orElse("")
        );
        String body = createEmailBody("recurring.html", variables);
        Email email = new Email(user.getEmail(), "Discounts", body);
        emailSender.sendNoReplyMail(email);
    }

    public void saveStat(int sent, String type) {
        log.info("saveStat > sent: [{}]", sent);
        if (sent > 0) emailStatRepository.save(EmailStat.builder().sent(sent).emailType(type).build());
    }

    public List<EmailStat> getEmailStatsInBetween(LocalDate from, LocalDate to) {
        return emailStatRepository.findAllByCreationTimeGreaterThanEqualAndCreationTimeLessThan(
                OffsetDateTime.of(from, LocalTime.MIDNIGHT, ZoneOffset.UTC),
                OffsetDateTime.of(to, LocalTime.MIDNIGHT, ZoneOffset.UTC)
        );
    }

    public PromotionEmail createPromotionEmail(PromotionEmail promotionEmail) {
        log.info("createPromotionEmail > promotionEmail: [{}]", promotionEmail);
        if (promotionalEmailRepository.existsPromotionEmailByName(promotionEmail.getName())) {
            throw new EmailException(ReasonCode.PROMOTION_EMAIL_NAME_OCCUPIED, "Email name is occupied please select a new one");
        }
        return promotionalEmailRepository.save(promotionEmail);
    }


    public List<PromotionEmail> getAllPromotionEmail() {
        log.info("getAllPromotionEmail");
        return promotionalEmailRepository.findAll();
    }

    public PromotionEmail getPromotionEmail(UUID id) {
        log.info("getPromotionEmail > id: [{}]", id);
        return promotionalEmailRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("promotional email was not found"));
    }

    public void deletePromotionEmail(UUID id) {
        log.info("deletePromotionEmail > id: [{}]", id);
        promotionalEmailRepository.deleteById(id);
    }

    /**
     * sends a recurring email, but catches every error in order complete the majority of the job
     */
    public boolean sendRecurringPromotionEmail(PromotionEmail promotionEmail, User user) {
        try {
            sendPromotionEmail(promotionEmail, user);
            return true;
        } catch (Exception e) {
            log.error("error during sending recurring email", e);
            return false;
        }
    }

    private void sendPromotionEmail(PromotionEmail promotionEmail, User user) {
        Map<String, Object> variables = Map.of(
                FULL_NAME, user.getFullName(),
                "text", promotionEmail.getText(),
                "unsubscribeUrl", emailProperties.getUnsubscribe().replace("{id}", user.getId().toString()),
                "productImageUrl", promotionEmail.getImageUrl()
        );
        String body = createEmailBody("promotion.html", variables);
        Email email = new Email(user.getEmail(), promotionEmail.getSubject(), body);
        emailSender.sendNoReplyMail(email);
    }

    /**
     * a promotion email can be tested, this function sends it to the given email, every other data filled with dummy values
     *
     * @param id    promotion email id
     * @param email test email
     */
    public void testPromotionEmail(UUID id, @jakarta.validation.constraints.Email String email) {
        PromotionEmail promotionEmail = promotionalEmailRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Promotion email was not found"));
        User testUser = User.builder().email(email).firstname("Test").lastname("Test").build();
        testUser.setId(UUID.randomUUID());
        sendPromotionEmail(promotionEmail, testUser);
    }
}