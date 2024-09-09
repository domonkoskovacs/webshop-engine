package hu.webshop.engine.webshopbe.domain.email.value;

public record Email(
        String to,
        String subject,
        String body
) {
}
