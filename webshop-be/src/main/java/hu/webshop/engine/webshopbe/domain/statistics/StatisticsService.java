package hu.webshop.engine.webshopbe.domain.statistics;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.order.OrderService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.statistics.dto.ProductStatistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.CustomerTypeDistribution;
import hu.webshop.engine.webshopbe.domain.statistics.value.OrderStatistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.OrderStatusDistribution;
import hu.webshop.engine.webshopbe.domain.statistics.value.Statistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.UserStatistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.WeeklyOrderStatistics;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
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
    private final ProductService productService;

    public Statistics calculateStatistics(LocalDate from, LocalDate to, Integer topCount) {
        log.info("calculateStatistics > from: [{}], to: [{}], topCount: [{}]", from, to, topCount);
        DateBetween dateBetween = TimeUtil.validateAndSetDateBetween(from, to);
        return new Statistics(
                getMostSavedProducts(topCount),
                getMostOrderedProducts(dateBetween.from(), dateBetween.to(), topCount),
                getMostReturnedProducts(dateBetween.from(), dateBetween.to(), topCount),
                getTopSpendingUsers(dateBetween.from(), dateBetween.to(), topCount),
                getTopOrderingUsers(dateBetween.from(), dateBetween.to(), topCount),
                createOrderStatistics(dateBetween.from(), dateBetween.to()),
                createWeeklyOrderStatistics(dateBetween.from(), dateBetween.to()),
                createCustomerTypeDistribution(dateBetween.from(), dateBetween.to()),
                createOrderStatusDistribution(dateBetween.from(), dateBetween.to()),
                computeTotalRevenue(dateBetween.from(), dateBetween.to()),
                computeAverageOrderValue(dateBetween.from(), dateBetween.to())
        );
    }

    private List<ProductStatistics> getMostSavedProducts(Integer topCount) {
        return userService.getUsers().stream()
                .flatMap(user -> user.getSaved().stream())
                .collect(Collectors.toMap(Product::getId, product -> new ProductStatistics(product, 0), (acc, item) -> {
                    acc.setCount(acc.getCount() + 1);
                    return acc;
                }))
                .values().stream()
                .sorted(Comparator.comparingInt(ProductStatistics::getCount).reversed())
                .limit(topCount)
                .toList();
    }

    private List<ProductStatistics> getMostOrderedProducts(LocalDate from, LocalDate to, Integer mostOrderedProductCount) {
        return orderService.getAllBetween(from, to).stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(
                        OrderItem::getProductId,
                        Collectors.summingInt(OrderItem::getCount)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<UUID, Integer>comparingByValue().reversed())
                .limit(mostOrderedProductCount)
                .map(entry -> new ProductStatistics(
                        productService.getById(entry.getKey()),
                        entry.getValue()
                ))
                .toList();
    }

    private List<ProductStatistics> getMostReturnedProducts(LocalDate from, LocalDate to, Integer mostOrderedProductCount) {
        return orderService.getAllBetween(from, to).stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(
                        OrderItem::getProductId,
                        Collectors.summingInt(OrderItem::getReturnedCount)
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<UUID, Integer>comparingByValue().reversed())
                .limit(mostOrderedProductCount)
                .map(entry -> new ProductStatistics(
                        productService.getById(entry.getKey()),
                        entry.getValue()
                ))
                .toList();
    }

    private List<UserStatistics> getTopSpendingUsers(LocalDate from, LocalDate to, Integer topUserCount) {
        return orderService.getAllBetween(from, to).stream()
                .collect(Collectors.groupingBy(
                        Order::getUser,
                        Collectors.summingDouble(Order::getTotalPrice)
                ))
                .entrySet().stream()
                .map(entry -> new UserStatistics(entry.getKey().getEmail(), entry.getValue()))
                .sorted(Comparator.comparingDouble(UserStatistics::amountOrdered).reversed())
                .limit(topUserCount)
                .toList();
    }

    private List<UserStatistics> getTopOrderingUsers(LocalDate from, LocalDate to, Integer topUserCount) {
        return orderService.getAllBetween(from, to).stream()
                .collect(Collectors.groupingBy(
                        Order::getUser,
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ))
                .entrySet().stream()
                .map(entry -> new UserStatistics(entry.getKey().getEmail(), entry.getValue().doubleValue()))
                .sorted(Comparator.comparingDouble(UserStatistics::amountOrdered).reversed())
                .limit(topUserCount)
                .toList();
    }

    private List<OrderStatistics> createOrderStatistics(LocalDate from, LocalDate to) {
        return orderService.getAllBetween(from, to).stream()
                .collect(Collectors.groupingBy(order -> order.getOrderDate().toLocalDate()))
                .entrySet().stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    List<Order> ordersForDate = entry.getValue();
                    double totalPriceSum = ordersForDate.stream()
                            .mapToDouble(Order::getTotalPrice)
                            .sum();
                    int orderCount = ordersForDate.size();
                    return new OrderStatistics(date, totalPriceSum, orderCount);
                })
                .sorted(Comparator.comparing(OrderStatistics::date))
                .toList();
    }

    private List<WeeklyOrderStatistics> createWeeklyOrderStatistics(LocalDate from, LocalDate to) {
        return orderService.getAllBetween(from, to).stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().toLocalDate().getDayOfWeek(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> new WeeklyOrderStatistics(entry.getKey(), entry.getValue().intValue()))
                .sorted(Comparator.comparing(WeeklyOrderStatistics::dayOfWeek))
                .toList();
    }

    private CustomerTypeDistribution createCustomerTypeDistribution(LocalDate from, LocalDate to) {
        Set<User> usersInTimeframe = orderService.getAllBetween(from, to).stream()
                .map(Order::getUser)
                .collect(Collectors.toSet());

        int newCustomers = (int) usersInTimeframe.stream()
                .filter(user -> user.getOrders().size() == 1)
                .count();

        int returningCustomers = usersInTimeframe.size() - newCustomers;

        return new CustomerTypeDistribution(newCustomers, returningCustomers);
    }

    private OrderStatusDistribution createOrderStatusDistribution(LocalDate from, LocalDate to) {
        return orderService.getAllBetween(from, to).stream()
                .map(order -> OrderStatusDistribution.empty().accumulate(order))
                .reduce(OrderStatusDistribution.empty(), OrderStatusDistribution::combine);
    }

    private Double computeTotalRevenue(LocalDate from, LocalDate to) {
        return orderService.getAllBetween(from, to).stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }

    private Double computeAverageOrderValue(LocalDate from, LocalDate to) {
        return orderService.getAllBetween(from, to).stream()
                .collect(Collectors.teeing(
                        Collectors.summingDouble(Order::getTotalPrice),
                        Collectors.counting(),
                        (total, count) -> count > 0 ? total / count : 0.0
                ));
    }

}
