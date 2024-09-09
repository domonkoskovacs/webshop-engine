package hu.webshop.engine.webshopbe.domain.statistics;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.email.entity.EmailStat;
import hu.webshop.engine.webshopbe.domain.order.OrderService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.statistics.dto.ProductStatistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.OrderStatistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.Statistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.UserStatistics;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.util.TimeUtil;
import hu.webshop.engine.webshopbe.domain.util.value.DateBetween;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final OrderService orderService;
    private final UserService userService;
    private final EmailService emailService;

    public Statistics calculateStatistics(LocalDate from, LocalDate to, Integer mostSavedProductCount, Integer mostOrderedProductCount, Integer topUserCount) {
        log.info("calculateStatistics > from: [{}], to: [{}], mostSavedProductCount: [{}], mostOrderedProductCount: [{}], topUserCount: [{}]", from, to, mostSavedProductCount, mostOrderedProductCount, topUserCount);
        DateBetween dateBetween = TimeUtil.validateAndSetDateBetween(from, to);
        return new Statistics(
                getMostSavedProducts(mostSavedProductCount),
                getMostOrderedProducts(dateBetween.from(), dateBetween.to(), mostOrderedProductCount),
                createOrderStatistics(dateBetween.from(), dateBetween.to()),
                getTopUsers(dateBetween.from(), dateBetween.to(), topUserCount),
                getEmailsSent(dateBetween.from(), dateBetween.to())
        );
    }

    private List<ProductStatistics> getMostSavedProducts(Integer mostSavedProductCount) {
        return userService.getUsers().stream()
                .flatMap(user -> user.getSaved().stream())
                .collect(Collectors.toMap(Product::getId, product -> new ProductStatistics(product, 0), (acc, item) -> {
                    acc.setCount(acc.getCount() + 1);
                    return acc;
                }))
                .values().stream()
                .sorted(Comparator.comparingInt(ProductStatistics::getCount).reversed())
                .limit(mostSavedProductCount)
                .toList();
    }

    private List<ProductStatistics> getMostOrderedProducts(LocalDate from, LocalDate to, Integer mostOrderedProductCount) {
        return orderService.getAllBetween(from, to).stream()
                .flatMap(order -> order.getProducts().stream())
                .map(OrderItem::getProduct)
                .collect(Collectors.toMap(Product::getId, product -> new ProductStatistics(product, 0), (acc, item) -> {
                    acc.setCount(acc.getCount() + item.getProduct().getCount());
                    return acc;
                }))
                .values().stream()
                .sorted(Comparator.comparingInt(ProductStatistics::getCount).reversed())
                .limit(mostOrderedProductCount)
                .toList();
    }

    private List<OrderStatistics> createOrderStatistics(LocalDate from, LocalDate to) {
        return orderService.getAllBetween(from, to).stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().toLocalDate(),
                        Collectors.reducing(
                                new OrderStatistics(null, 0.0, 0), // todo review count is correct
                                order -> new OrderStatistics(order.getOrderDate().toLocalDate(), order.getTotalPrice(), 1),
                                (s1, s2) -> new OrderStatistics(
                                        s1.date(),
                                        s1.orderPriceSum() + s2.orderPriceSum(),
                                        s1.orderCount() + 1
                                )
                        )
                ))
                .values().stream()
                .sorted(Comparator.comparing(OrderStatistics::date))
                .toList();
    }

    private List<UserStatistics> getTopUsers(LocalDate from, LocalDate to, Integer topUserCount) {
        return orderService.getAllBetween(from, to).stream()
                .collect(Collectors.groupingBy(
                        Order::getUser,
                        Collectors.summingDouble(Order::getTotalPrice)
                ))
                .entrySet().stream()
                .map(entry -> new UserStatistics(entry.getKey(), entry.getValue()))
                .sorted(Comparator.comparingDouble(UserStatistics::amountOrdered).reversed())
                .limit(topUserCount)
                .toList();
    }

    private Integer getEmailsSent(LocalDate from, LocalDate to) {
        return emailService.getEmailStatsInBetween(from, to).stream()
                .mapToInt(EmailStat::getSent)
                .sum();
    }
}
