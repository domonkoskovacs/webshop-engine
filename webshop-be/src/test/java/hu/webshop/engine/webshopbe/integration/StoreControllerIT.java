package hu.webshop.engine.webshopbe.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.model.request.StoreRequest;
import lombok.RequiredArgsConstructor;

@DisplayName("Store controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class StoreControllerIT extends IntegrationTest {

    private static final String BASE_URL = "/api/store";

    @Test
    @DisplayName("store can be retrieved")
    void storeCanBeRetrieved() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(BASE_URL, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.minOrderPrice").value("0.0"));
    }

    @Test
    @DisplayName("store can be updated")
    void storeCanBeUpdated() throws Exception {
        //Given
        StoreRequest request = new StoreRequest(10.0, 10.0, 10, null, null, null, true, false, false);

        //When
        ResultActions resultActions = performPut(BASE_URL, request, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.maxArticle").value("10"));
    }
}
