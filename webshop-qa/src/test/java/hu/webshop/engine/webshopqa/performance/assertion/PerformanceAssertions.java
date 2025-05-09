package hu.webshop.engine.webshopqa.performance.assertion;

import static io.gatling.javaapi.core.CoreDsl.forAll;
import static io.gatling.javaapi.core.CoreDsl.global;

import java.util.List;

import io.gatling.javaapi.core.Assertion;

public class PerformanceAssertions {

    public static List<Assertion> defaultAssertions() {
        return List.of(
                global().failedRequests().count().is(0L),
                forAll().responseTime().percentile(95).lt(300)
        );
    }
}
