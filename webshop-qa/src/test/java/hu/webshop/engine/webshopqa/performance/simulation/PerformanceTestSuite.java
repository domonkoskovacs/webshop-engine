package hu.webshop.engine.webshopqa.performance.simulation;

import static io.gatling.javaapi.http.HttpDsl.http;

import hu.webshop.engine.webshopqa.configuration.TestConfiguration;
import hu.webshop.engine.webshopqa.performance.assertion.PerformanceAssertions;
import hu.webshop.engine.webshopqa.performance.injection.LoadProfileFactory;
import hu.webshop.engine.webshopqa.performance.scenario.CategoriesScenario;
import hu.webshop.engine.webshopqa.performance.scenario.ProductsScenario;
import hu.webshop.engine.webshopqa.performance.scenario.ArticlesScenario;
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
