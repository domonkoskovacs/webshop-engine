package hu.webshop.engine.webshopqa.performance.scenario;

import static io.gatling.javaapi.core.CoreDsl.jsonPath;
import static io.gatling.javaapi.core.CoreDsl.scenario;
import static io.gatling.javaapi.http.HttpDsl.http;
import static io.gatling.javaapi.http.HttpDsl.status;

import hu.webshop.engine.webshopqa.performance.endpoint.CategoryEndpoints;
import io.gatling.javaapi.core.ScenarioBuilder;

public class CategoriesScenario {
    public static ScenarioBuilder getAllCategories() {
        return scenario("GET /api/categories")
                .exec(
                        http("GET /api/categories")
                                .get(CategoryEndpoints.GET_ALL_CATEGORIES)
                                .check(
                                        status().is(200),
                                        jsonPath("$").exists()
                                )
                );
    }
}
