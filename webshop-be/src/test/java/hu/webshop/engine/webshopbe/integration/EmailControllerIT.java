package hu.webshop.engine.webshopbe.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.DayOfWeek;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.email.repository.PromotionEmailRepository;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.EmailRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.PromotionEmailRequest;
import lombok.RequiredArgsConstructor;

@DisplayName("Store controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class EmailControllerIT extends IntegrationTest {

    private static final String EMAIL_ID = "b7f86506-8ea8-4908-b8f4-668c5ec6a711";
    private final PromotionEmailRepository repository;

    @Test
    @DisplayName("promotion email can be created")
    void promotionEmailCanBeCreated() throws Exception {
        //Given
        PromotionEmailRequest request = new PromotionEmailRequest(
                "test", "text", "subject", "someUrl",
                List.of(DayOfWeek.FRIDAY), 10, 10
        );

        //When
        ResultActions resultActions = performPost(ApiPaths.PromotionEmails.BASE, request, Role.ROLE_ADMIN);
        transaction();

        //Then
        resultActions.andExpect(status().isCreated());
        awaitFor(() -> !repository.findAll().isEmpty());
    }

    @Test
    @DisplayName("cant be created if email occupied")
    @DataSet("promotionEmail.yml")
    void cantBeCreatedIfEmailOccupied() throws Exception {
        //Given
        PromotionEmailRequest request = new PromotionEmailRequest(
                "name", "text", "subject", "someUrl",
                List.of(DayOfWeek.FRIDAY), 10, 10
        );

        //When
        ResultActions resultActions = performPost(ApiPaths.PromotionEmails.BASE, request, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("all emails can be retrieved")
    @DataSet("promotionEmail.yml")
    void allEmailsCanBeRetrieved() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(ApiPaths.PromotionEmails.BASE, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$").isArray()).andExpect(jsonPath("$").isNotEmpty());
    }

    @Test
    @DisplayName("promotion email can be deleted")
    @DataSet("promotionEmail.yml")
    void promotionEmailCanBeDeleted() throws Exception {
        //Given //When
        ResultActions resultActions = performDelete(pathWithId(ApiPaths.PromotionEmails.BY_ID, EMAIL_ID), Role.ROLE_ADMIN);
        transaction();

        //Then
        resultActions.andExpect(status().isOk());
        awaitFor(() -> repository.findById(UUID.fromString(EMAIL_ID)).orElse(null) == null);
    }

    @Test
    @DisplayName("email can be test sent")
    @DataSet("promotionEmail.yml")
    void emailCanBeTestSent() throws Exception {
        //Given
        EmailRequest request = new EmailRequest("email@email.com");

        //When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.PromotionEmails.TEST, EMAIL_ID), request, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isOk());
    }
}
