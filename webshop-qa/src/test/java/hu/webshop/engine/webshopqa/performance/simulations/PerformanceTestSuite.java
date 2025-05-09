package hu.webshop.engine.webshopqa.performance.simulations;

import static io.gatling.javaapi.http.HttpDsl.http;

import hu.webshop.engine.webshopqa.configuration.TestConfiguration;
import hu.webshop.engine.webshopqa.performance.assertions.PerformanceAssertions;
import hu.webshop.engine.webshopqa.performance.injection.LoadProfileFactory;
import hu.webshop.engine.webshopqa.performance.scenarios.CategoriesScenario;
import hu.webshop.engine.webshopqa.performance.scenarios.ProductsScenario;
import hu.webshop.engine.webshopqa.performance.scenarios.ArticlesScenario;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;

public class PerformanceTestSuite extends Simulation {

    private static final String baseUrl = TestConfiguration.getPerformanceBaseUrl();

    private final HttpProtocolBuilder httpProtocol = http
            .baseUrl(baseUrl)
            .acceptHeader("application/json")
            .contentTypeHeader("application/json");

    {
        setUp(
                LoadProfileFactory.buildInjectionProfile(CategoriesScenario.getAllCategories()),
                LoadProfileFactory.buildInjectionProfile(ProductsScenario.getAllProducts()),
                LoadProfileFactory.buildInjectionProfile(ArticlesScenario.getArticles())
        )
                .protocols(httpProtocol)
                .assertions(PerformanceAssertions.defaultAssertions());
    }
}
