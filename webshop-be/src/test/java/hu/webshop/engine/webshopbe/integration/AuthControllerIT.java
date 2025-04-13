package hu.webshop.engine.webshopbe.integration;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.LoginRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.TokenRequest;
import lombok.RequiredArgsConstructor;

@DisplayName("Authentication controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class AuthControllerIT extends IntegrationTest {

    private static final String BASE_URL = "/api/auth";

    @Test
    @DisplayName("user can successfully log in")
    @DataSet("verifiedUser.yml")
    void userCanSuccessfullyLogIn() throws Exception {
        //Given //When
        ResultActions resultActions = performPost(BASE_URL + "/login", createLoginRequest("pass"));

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.accessToken").exists());
    }

    public static LoginRequest createLoginRequest(String password) {
        return new LoginRequest("test@test.com", password);
    }

    @Test
    @DisplayName("user cannot log in if not verified")
    @DataSet("notVerifiedUser.yml")
    void userCannotLogInIfNotVerified() throws Exception {
        //Given //When
        ResultActions resultActions = performPost(BASE_URL + "/login", createLoginRequest("pass"));

        //Then
        resultActions.andExpect(status().isUnauthorized()).andExpect(jsonPath("$.error[0].reasonCode").value("UNVERIFIED_USER"));
    }

    @Test
    @DisplayName("user cannot log in with wrong password")
    @DataSet("verifiedUser.yml")
    void userCannotLogInWithWrongPassword() throws Exception {
        //Given //When
        ResultActions resultActions = performPost(BASE_URL + "/login", createLoginRequest("wrong"));

        //Then
        resultActions.andExpect(status().isUnauthorized()).andExpect(jsonPath("$.error[0].reasonCode").value("WRONG_PASSWORD"));

    }

    @Test
    @DisplayName("user can use a refresh token successfully")
    @DataSet("verifiedUser.yml")
    void userCanUseARefreshTokenSuccessfully() throws Exception {
        //Given
        MvcResult mvcResult = performPost(BASE_URL + "/login", createLoginRequest("pass")).andExpect(status().isOk()).andReturn();
        String refreshToken = objectMapper.readTree(mvcResult.getResponse().getContentAsString()).get("refreshToken").asText();

        //When
        ResultActions resultActions = performPost(BASE_URL + "/refreshToken", new TokenRequest(refreshToken));

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.accessToken").exists()).andExpect(jsonPath("$.refreshToken").exists());
    }
}
