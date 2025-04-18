package hu.webshop.engine.webshopbe.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.StoreRequest;
import lombok.RequiredArgsConstructor;

@DisplayName("Store controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class StoreControllerIT extends IntegrationTest {

    @Test
    @DisplayName("store can be retrieved")
    void storeCanBeRetrieved() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(ApiPaths.Store.BASE, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.minOrderPrice").value("0.0"));
    }

    @Test
    @DisplayName("store can be updated")
    void storeCanBeUpdated() throws Exception {
        //Given
        StoreRequest request = new StoreRequest("name", 10.0, 10.0, 10, 24, null, null, null, true, false, false);

        //When
        ResultActions resultActions = performPut(ApiPaths.Store.BASE, request, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.returnPeriod").value("10"));
    }

    @Test
    @DisplayName("store can be retrieved")
    @DataSet("verifiedUser.yml")
    void publicStoreCanBeRetrieved() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(ApiPaths.Store.PUBLIC, Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.minOrderPrice").value("0.0"));
    }
}
