package hu.webshop.engine.webshopqa.performance.injection;

import static io.gatling.javaapi.core.CoreDsl.atOnceUsers;
import static io.gatling.javaapi.core.CoreDsl.constantUsersPerSec;
import static io.gatling.javaapi.core.CoreDsl.incrementUsersPerSec;
import static io.gatling.javaapi.core.CoreDsl.rampUsers;
import static io.gatling.javaapi.core.CoreDsl.rampUsersPerSec;
import static io.gatling.javaapi.core.CoreDsl.stressPeakUsers;

import hu.webshop.engine.webshopqa.configuration.PerformanceTestType;
import hu.webshop.engine.webshopqa.configuration.TestConfiguration;
import io.gatling.javaapi.core.PopulationBuilder;
import io.gatling.javaapi.core.ScenarioBuilder;

public class LoadProfileFactory {

    public static PopulationBuilder buildInjectionProfile(ScenarioBuilder scn) {
        PerformanceTestType testType = TestConfiguration.getPerformanceTestType();

        return switch (testType) {
            case CAPACITY -> scn.injectOpen(
                    incrementUsersPerSec(1)
                            .times(4)
                            .eachLevelLasting(10)
                            .separatedByRampsLasting(4)
                            .startingFrom(10));
            case SOAK -> scn.injectOpen(constantUsersPerSec(1).during(180));
            case STRESS -> scn.injectOpen(stressPeakUsers(200).during(20));
            case BREAKPOINT -> scn.injectOpen(rampUsers(300).during(120));
            case RAMP_HOLD -> scn.injectOpen(
                    rampUsersPerSec(0).to(20).during(30),
                    constantUsersPerSec(20).during(60));
            case SMOKE -> scn.injectOpen(atOnceUsers(1));
        };
    }
}
