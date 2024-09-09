package hu.webshop.engine.webshopbe.domain.statistics.value;


import hu.webshop.engine.webshopbe.domain.user.entity.User;

public record UserStatistics(
        User user,
        Double amountOrdered
) {
}
