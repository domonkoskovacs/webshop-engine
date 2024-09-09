package hu.webshop.engine.webshopbe.domain.util.value;

import java.time.LocalDate;

public record DateBetween(
        LocalDate from,
        LocalDate to
) {
}
