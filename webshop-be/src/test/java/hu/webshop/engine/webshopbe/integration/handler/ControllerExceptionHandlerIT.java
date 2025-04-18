package hu.webshop.engine.webshopbe.integration.handler;


import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.user.value.Gender;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CsvRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.RegistrationRequest;
import lombok.RequiredArgsConstructor;

@DisplayName("Exception handler integration test")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class ControllerExceptionHandlerIT extends IntegrationTest {

    @Test
    @DisplayName("bad argument exception is handled")
    void badArgumentExceptionIsHandled() throws Exception {
        //Given
        RegistrationRequest userRequest = new RegistrationRequest("bad email address", "test", "test", "pass", "123", Gender.MALE, true);

        //When
        ResultActions resultActions = performPost(ApiPaths.Users.REGISTER, userRequest);

        //Then
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("csv exception is handled")
    void csvExceptionIsHandled() throws Exception {
        //Given
        CsvRequest request = new CsvRequest("bad csv");

        //When
        ResultActions resultActions = performPost(ApiPaths.Products.IMPORT, request, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isInternalServerError());
    }
}
