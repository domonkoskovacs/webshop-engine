package hu.webshop.engine.webshopbe.domain.image.strategy;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import hu.webshop.engine.webshopbe.domain.image.value.ImageStorageType;

@Component
public class ImageStorageStrategyRegistry {

    private final Map<ImageStorageType, ImageStorageStrategy> strategyMap;

    public ImageStorageStrategyRegistry(List<ImageStorageStrategy> strategies) {
        this.strategyMap = strategies.stream().collect(Collectors.toMap(ImageStorageStrategy::getStorageType, s -> s));
    }

    public ImageStorageStrategy get(ImageStorageType type) {
        return strategyMap.get(type);
    }
}

