package hu.webshop.engine.webshopbe.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.store.StoreService;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.model.request.SocialIconRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.StoreRequest;
import lombok.RequiredArgsConstructor;

@DisplayName("Store controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class StoreControllerIT extends IntegrationTest {

    private static final String BASE_URL = "/api/store";
    private final StoreService storeService;

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
        StoreRequest request = new StoreRequest(10.0, null, null, null, 10, true, false, false);

        //When
        ResultActions resultActions = performPut(BASE_URL, request, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.maxArticle").value("10"));
    }

    @Test
    @DisplayName("social icon can be added")
    void socialIconCanBeAdded() throws Exception {
        //Given
        if (storeService.getStore().getSocialIcons() != null && !storeService.getStore().getSocialIcons().isEmpty()) {
            Assertions.fail();
        }
        SocialIconRequest request = new SocialIconRequest("url", "icon", 1);

        //When
        ResultActions resultActions = performPost(BASE_URL + "/socialIcon", request, Role.ROLE_ADMIN);
        transaction();

        //Then
        resultActions.andExpect(status().isCreated());
        awaitFor(() -> !storeService.getStore().getSocialIcons().isEmpty());
    }

    @Test
    @DisplayName("social icon can be removed")
    void socialIconCanBeRemoved() throws Exception {
        //Given
        if (storeService.getStore().getSocialIcons() != null && !storeService.getStore().getSocialIcons().isEmpty()) {
            Assertions.fail();
        }
        SocialIconRequest request = new SocialIconRequest("url", "icon", 1);
        ResultActions initAction = performPost(BASE_URL + "/socialIcon", request, Role.ROLE_ADMIN);
        transaction();
        initAction.andExpect(status().isCreated());
        awaitFor(() -> !storeService.getStore().getSocialIcons().isEmpty());
        UUID id = storeService.getStore().getSocialIcons().get(0).getId();

        //When
        ResultActions resultActions = performDelete(BASE_URL + "/socialIcon/" + id, Role.ROLE_ADMIN);
        transaction();

        //Then
        resultActions.andExpect(status().isOk());
        awaitFor(() -> storeService.getStore().getSocialIcons().isEmpty());
    }
}
