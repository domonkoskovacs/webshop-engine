package hu.webshop.engine.webshopbe.domain.user.value;

import java.util.UUID;

public record CartItem(int count, UUID productId) {
}
