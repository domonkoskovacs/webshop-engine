package hu.webshop.engine.webshopbe.domain.order.strategy;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.order.value.PaymentType;

@Component
public class PaymentStrategyRegistry {
    private final Map<PaymentType, PaymentStrategy> strategyMap;

    public PaymentStrategyRegistry(List<PaymentStrategy> strategies) {
        this.strategyMap = strategies.stream().collect(Collectors.toMap(PaymentStrategy::getPaymentType, s -> s));
    }

    public PaymentStrategy get(PaymentType type) {
        return strategyMap.get(type);
    }
}
