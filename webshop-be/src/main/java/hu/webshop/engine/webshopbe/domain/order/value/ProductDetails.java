package hu.webshop.engine.webshopbe.domain.order.value;

public record ProductDetails(
        String name, int quantity, double totalAmount
) {
}
