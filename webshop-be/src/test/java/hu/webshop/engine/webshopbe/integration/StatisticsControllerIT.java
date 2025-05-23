package hu.webshop.engine.webshopbe.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import lombok.RequiredArgsConstructor;

@DisplayName("Statistics controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class StatisticsControllerIT extends IntegrationTest {

    @Test
    @DisplayName("admin can get statistics")
    @DataSet("statistics.yml")
    void adminCanGetStatistics() throws Exception {
        //Given
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("from", "2023-09-09");
        params.add("to", "2023-09-11");

        //When
        ResultActions resultActions = performGet(ApiPaths.Statistics.BASE, Role.ROLE_ADMIN, params);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.mostSavedProducts").isArray()).andExpect(jsonPath("$.mostSavedProducts").isNotEmpty())
                .andExpect(jsonPath("$.mostOrderedProducts").isArray()).andExpect(jsonPath("$.mostOrderedProducts").isNotEmpty())
                .andExpect(jsonPath("$.mostReturnedProducts").isArray()).andExpect(jsonPath("$.mostReturnedProducts").isNotEmpty())
                .andExpect(jsonPath("$.topSpendingUsers").isArray()).andExpect(jsonPath("$.topSpendingUsers").isNotEmpty())
                .andExpect(jsonPath("$.topOrderingUsers").isArray()).andExpect(jsonPath("$.topOrderingUsers").isNotEmpty())
                .andExpect(jsonPath("$.orderCounts").isArray()).andExpect(jsonPath("$.orderCounts").isNotEmpty())
                .andExpect(jsonPath("$.orderPrices").isArray()).andExpect(jsonPath("$.orderPrices").isNotEmpty())
                .andExpect(jsonPath("$.orderByDayOfWeek").isArray()).andExpect(jsonPath("$.orderByDayOfWeek").isNotEmpty())
                .andExpect(jsonPath("$.customerTypeDistribution.newCustomers").value(1))
                .andExpect(jsonPath("$.orderStatusDistribution.pendingOrders").value(1))
                .andExpect(jsonPath("$.orderStatusDistribution.processingOrders").value(1))
                .andExpect(jsonPath("$.orderStatusDistribution.shippedOrders").value(1))
                .andExpect(jsonPath("$.orderStatusDistribution.returnedOrders").value(1))
                .andExpect(jsonPath("$.orderStatusDistribution.cancelledOrders").value(1))
                .andExpect(jsonPath("$.averageOrderValue").value(15))
                .andExpect(jsonPath("$.totalRevenue").value(100));
    }
}
