package hu.webshop.engine.webshopqa.performance.scenarios;

import static io.gatling.javaapi.core.CoreDsl.jsonPath;
import static io.gatling.javaapi.core.CoreDsl.scenario;
import static io.gatling.javaapi.http.HttpDsl.http;
import static io.gatling.javaapi.http.HttpDsl.status;

import hu.webshop.engine.webshopqa.performance.endpoints.ProductEndpoints;
import io.gatling.javaapi.core.ScenarioBuilder;

public class ProductsScenario {
    public static ScenarioBuilder getAllProducts() {
        return scenario("GET /api/products")
                .exec(
                        http("GET /api/products")
                                .get(ProductEndpoints.GET_ALL_PRODUCTS)
                                .check(
                                        status().is(200),
                                        jsonPath("$.content").exists()
                                )
                );
    }
}
