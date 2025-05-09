package hu.webshop.engine.webshopqa.performance.scenarios;

import static io.gatling.javaapi.core.CoreDsl.jsonPath;
import static io.gatling.javaapi.core.CoreDsl.scenario;
import static io.gatling.javaapi.http.HttpDsl.http;
import static io.gatling.javaapi.http.HttpDsl.status;

import hu.webshop.engine.webshopqa.performance.endpoints.ArticleEndpoints;
import io.gatling.javaapi.core.ScenarioBuilder;

public class ArticlesScenario {
    public static ScenarioBuilder getArticles() {
        return scenario("GET /api/articles")
                .exec(
                        http("GET /api/articles")
                                .get(ArticleEndpoints.GET_ARTICLES)
                                .check(
                                        status().is(200),
                                        jsonPath("$[0].id").exists()
                                )
                );
    }
}
