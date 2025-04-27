package hu.webshop.engine.webshopbe.infrastructure.config.endpoint;

import java.util.List;
import java.util.Objects;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.util.pattern.PathPattern;

import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Public;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PublicEndpointsCollector {

    private final ApplicationContext applicationContext;

    @Getter
    private List<String> publicEndpoints;

    @PostConstruct
    public void init() {
        RequestMappingHandlerMapping handlerMapping = applicationContext.getBean("requestMappingHandlerMapping", RequestMappingHandlerMapping.class);

        this.publicEndpoints = handlerMapping.getHandlerMethods().entrySet().stream()
                .filter(entry -> entry.getValue().hasMethodAnnotation(Public.class))
                .map(entry -> entry.getKey().getPathPatternsCondition())
                .filter(Objects::nonNull)
                .flatMap(condition -> condition.getPatterns().stream())
                .map(PathPattern::getPatternString)
                .toList();
    }

}
