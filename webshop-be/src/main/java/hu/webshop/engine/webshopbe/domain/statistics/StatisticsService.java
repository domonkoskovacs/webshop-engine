package hu.webshop.engine.webshopbe.domain.statistics;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.ToIntFunction;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import hu.webshop.engine.webshopbe.domain.order.OrderQueryService;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.order.entity.OrderItem;
import hu.webshop.engine.webshopbe.domain.order.value.OrderStatus;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.statistics.value.CustomerTypeDistribution;
import hu.webshop.engine.webshopbe.domain.statistics.value.OrderCountStatistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.OrderPriceStatistics;
import hu.webshop.engine.webshopbe.domain.statistics.value.OrderStatusDistribution;
import hu.webshop.engine.webshopbe.domain.statistics.value.ProductStatistics;
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

    private final OrderQueryService orderQueryService;
    private final UserService userService;
    private final ProductService productService;

    public Statistics calculateStatistics(LocalDate from, LocalDate to, Integer topCount) {
        log.info("calculateStatistics > from: [{}], to: [{}], topCount: [{}]", from, to, topCount);
        DateBetween dateBetween = TimeUtil.validateAndSetDateBetween(from, to);
        List<Order> orders = orderQueryService.getAllBetween(dateBetween.from(), dateBetween.to());
        return new Statistics(
                getMostSavedProducts(topCount),
                getMostOrderedProducts(orders, topCount),
                getMostReturnedProducts(orders, topCount),
                getTopSpendingUsers(orders, topCount),
                getTopOrderingUsers(orders, topCount),
                createOrderCountStatistics(orders),
                createOrderPriceStatistics(orders),
                createWeeklyOrderStatistics(orders),
                createCustomerTypeDistribution(orders, from),
                createOrderStatusDistribution(orders),
                computeAverageOrderValue(orders),
                computeTotalRevenue(orders),
                computeTotalShippingCost(orders)
        );
    }

    private List<ProductStatistics> getMostSavedProducts(Integer topCount) {
        return userService.getUsers().stream()
                .flatMap(user -> user.getSaved().stream())
                .collect(Collectors.groupingBy(
                        Product::getId,
                        Collectors.summingInt(product -> 1)
                ))
                .entrySet().stream()
                .map(entry -> new ProductStatistics(
                        productService.getById(entry.getKey()),
                        entry.getValue()
                ))
                .sorted(Comparator.comparingInt(ProductStatistics::count).reversed())
                .limit(topCount)
                .toList();
    }

    private List<ProductStatistics> getMostOrderedProducts(List<Order> orders, Integer mostOrderedProductCount) {
        return getProductStatistics(orders, mostOrderedProductCount, OrderItem::getCount);
    }

    private List<ProductStatistics> getMostReturnedProducts(List<Order> orders, Integer mostOrderedProductCount) {
        return getProductStatistics(orders, mostOrderedProductCount, OrderItem::getReturnedCount);
    }

    private List<ProductStatistics> getProductStatistics(List<Order> orders, Integer limit, ToIntFunction<OrderItem> valueExtractor) {
        return orders.stream()
                .flatMap(order -> order.getItems().stream())
                .collect(Collectors.groupingBy(
                        OrderItem::getProductId,
                        Collectors.summingInt(valueExtractor)
                ))
                .entrySet().stream()
                .filter(entry -> entry.getValue() > 0)
                .sorted(Map.Entry.<UUID, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> new ProductStatistics(
                        productService.getById(entry.getKey()),
                        entry.getValue()
                ))
                .toList();
    }

    private List<UserStatistics> getTopSpendingUsers(List<Order> orders, Integer topUserCount) {
        return orders.stream()
                .collect(Collectors.groupingBy(
                        Order::getUser,
                        Collectors.summingDouble(Order::getTotalPrice)
                ))
                .entrySet().stream()
                .map(entry -> new UserStatistics(entry.getKey().getEmail(), entry.getKey().getFullName(), entry.getValue()))
                .sorted(Comparator.comparingDouble(UserStatistics::amount).reversed())
                .limit(topUserCount)
                .toList();
    }

    private List<UserStatistics> getTopOrderingUsers(List<Order> orders, Integer topUserCount) {
        return orders.stream()
                .collect(Collectors.groupingBy(
                        Order::getUser,
                        Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ))
                .entrySet().stream()
                .map(entry -> new UserStatistics(entry.getKey().getEmail(), entry.getKey().getFullName(), entry.getValue().doubleValue()))
                .sorted(Comparator.comparingDouble(UserStatistics::amount).reversed())
                .limit(topUserCount)
                .toList();
    }

    private List<OrderCountStatistics> createOrderCountStatistics(List<Order> orders) {
        return orders.stream()
                .collect(Collectors.groupingBy(order -> order.getOrderDate().toLocalDate()))
                .entrySet().stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    List<Order> ordersForDate = entry.getValue();
                    int totalCount = ordersForDate.size();
                    int completedCount = (int) ordersForDate.stream()
                            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                            .count();
                    return new OrderCountStatistics(date, totalCount, completedCount);
                })
                .sorted(Comparator.comparing(OrderCountStatistics::date))
                .toList();
    }
    private List<OrderPriceStatistics> createOrderPriceStatistics(List<Order> orders) {
        return orders.stream()
                .collect(Collectors.groupingBy(order -> order.getOrderDate().toLocalDate()))
                .entrySet().stream()
                .map(entry -> {
                    LocalDate date = entry.getKey();
                    List<Order> ordersForDate = entry.getValue();
                    double totalProductValue = ordersForDate.stream()
                            .mapToDouble(order -> order.getTotalPrice() - order.getShippingPrice())
                            .sum();
                    double completedProductValue = ordersForDate.stream()
                            .filter(order -> order.getStatus() == OrderStatus.COMPLETED)
                            .mapToDouble(order -> order.getTotalPrice() - order.getShippingPrice())
                            .sum();
                    return new OrderPriceStatistics(date, totalProductValue, completedProductValue);
                })
                .sorted(Comparator.comparing(OrderPriceStatistics::date))
                .toList();
    }

    private List<WeeklyOrderStatistics> createWeeklyOrderStatistics(List<Order> orders) {
        return orders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().toLocalDate().getDayOfWeek(),
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(entry -> new WeeklyOrderStatistics(entry.getKey(), entry.getValue().intValue()))
                .sorted(Comparator.comparing(WeeklyOrderStatistics::dayOfWeek))
                .toList();
    }

    private CustomerTypeDistribution createCustomerTypeDistribution(List<Order> orders, LocalDate from) {
        Set<User> usersInTimeframe = orders.stream()
                .map(Order::getUser)
                .collect(Collectors.toSet());

        int newCustomers = (int) usersInTimeframe.stream()
                .filter(user -> user.getOrders().stream()
                        .map(Order::getOrderDate)
                        .noneMatch(orderDate -> orderDate.isBefore(from.atStartOfDay(ZoneId.systemDefault()).toOffsetDateTime())))
                .count();

        int returningCustomers = usersInTimeframe.size() - newCustomers;
        return new CustomerTypeDistribution(newCustomers, returningCustomers);
    }

    private OrderStatusDistribution createOrderStatusDistribution(List<Order> orders) {
        return orders.stream()
                .map(order -> OrderStatusDistribution.empty().accumulate(order))
                .reduce(OrderStatusDistribution.empty(), OrderStatusDistribution::combine);
    }

    private Double computeTotalRevenue(List<Order> orders) {
        return orders.stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();
    }

    private Double computeAverageOrderValue(List<Order> orders) {
        return orders.stream()
                .collect(Collectors.teeing(
                        Collectors.summingDouble(order -> order.getTotalPrice() - order.getShippingPrice()),
                        Collectors.counting(),
                        (total, count) -> count > 0 ? total / count : 0.0
                ));
    }

    private Double computeTotalShippingCost(List<Order> orders) {
        return orders.stream()
                .mapToDouble(Order::getShippingPrice)
                .sum();
    }

}
