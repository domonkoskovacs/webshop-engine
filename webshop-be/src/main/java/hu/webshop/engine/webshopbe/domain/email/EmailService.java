package hu.webshop.engine.webshopbe.domain.email;

import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.ISpringTemplateEngine;

import hu.webshop.engine.webshopbe.domain.email.entity.PromotionEmail;
import hu.webshop.engine.webshopbe.domain.email.properties.EmailProperties;
import hu.webshop.engine.webshopbe.domain.email.value.Email;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
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

    public void sendForgottenPasswordEmail(String to, UUID id) {
        log.info("sendForgottenPasswordEmail > to: [{}], id: [{}]", to, id);
        Map<String, Object> variables = Map.of(
                "url", emailProperties.getNewPassword().replace("{id}", id.toString())
        );
        String body = createEmailBody("forgotten-password.html", variables);
        Email email = new Email(to, "Forgotten password", body);
        emailSender.sendNoReplyMail(email);
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

    public void sendReturnRequestedEmail(Order order) {
        log.info("sendReturnRequestedEmail > order: [{}]", order);
        Map<String, Object> variables = Map.of(
                FULL_NAME, order.getUser().getFullName()
        );
        String body = createEmailBody("return-order.html", variables);
        Email email = new Email(order.getUser().getEmail(), "Confirmation of Your Return Request", body);
        emailSender.sendNoReplyMail(email);
    }

    public void sendMarketingEmail(User user, Product product) {
        Map<String, Object> variables = Map.of(
                FULL_NAME, user.getFullName(),
                "product", product,
                "unsubscribeUrl", emailProperties.getUnsubscribe().replace("{id}", user.getId().toString()),
                "productImageUrl", product.getImageUrls().stream().findFirst().orElse("")
        );
        String body = createEmailBody("recurring.html", variables);
        Email email = new Email(user.getEmail(), "Discounts", body);
        emailSender.sendNoReplyMail(email);
    }

    public void sendPromotionEmail(PromotionEmail promotionEmail, User user) {
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

    public String createEmailBody(String templateName, Map<String, Object> variables) {
        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(variables);
        return templateEngine.process(templateName, thymeleafContext);
    }

}