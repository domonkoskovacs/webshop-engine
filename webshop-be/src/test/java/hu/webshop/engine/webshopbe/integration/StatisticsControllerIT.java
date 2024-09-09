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
import lombok.RequiredArgsConstructor;

@DisplayName("Order controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class StatisticsControllerIT extends IntegrationTest {

    private static final String BASE_URL = "/api/statistics";

    @Test
    @DisplayName("admin can get statistics")
    @DataSet("statistics.yml")
    void adminCanGetStatistics() throws Exception {
        //Given
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("from", "2023-09-09");
        params.add("to", "2023-09-11");

        //When
        ResultActions resultActions = performGet(BASE_URL, Role.ROLE_ADMIN, params);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$.mostSavedProducts").isArray()).andExpect(jsonPath("$.mostSavedProducts").isNotEmpty())
                .andExpect(jsonPath("$.mostOrderedProducts").isArray()).andExpect(jsonPath("$.mostOrderedProducts").isNotEmpty())
                .andExpect(jsonPath("$.orderStatistics").isArray()).andExpect(jsonPath("$.orderStatistics").isNotEmpty())
                .andExpect(jsonPath("$.topUsers").isArray()).andExpect(jsonPath("$.topUsers").isNotEmpty())
                .andExpect(jsonPath("$.emailsSent").value(10));
    }
}
