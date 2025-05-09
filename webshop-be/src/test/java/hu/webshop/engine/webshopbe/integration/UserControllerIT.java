package hu.webshop.engine.webshopbe.integration;

import static hu.webshop.engine.webshopbe.integration.AuthControllerIT.createLoginRequest;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import com.github.database.rider.core.api.dataset.DataSet;
import hu.webshop.engine.webshopbe.base.IntegrationTest;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.user.repository.UserRepository;
import hu.webshop.engine.webshopbe.domain.user.value.Gender;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.AddressRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CartItemRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.EmailRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ForgottenPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.NewPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.RegistrationRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.UpdateUserRequest;
import lombok.RequiredArgsConstructor;

@DisplayName("User controller integration tests")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
class UserControllerIT extends IntegrationTest {
    private static final String BAD_UUID = "b7f86506-8ea8-4908-b8f4-668c5ec6a7e2";
    private static final String VERIFIED_USER = "b7f86506-8ea8-4908-b8f4-668c5ec6a7ee";
    private final UserRepository userRepository;

    @Test
    @DisplayName("user can successfully register")
    void userCanSuccessfullyRegister() throws Exception {
        //Given
        String email = "email@email.com";
        RegistrationRequest userRequest = new RegistrationRequest(email, "test", "test", "pass", "123", Gender.MALE, true);

        //When
        ResultActions resultActions = performPost(ApiPaths.Users.REGISTER, userRequest);
        transaction();

        //Then
        resultActions.andExpect(status().isCreated());
        awaitFor(() -> {
            Optional<User> user = userRepository.findByEmail(email);
            return user.isPresent() && !user.get().getVerified();
        });
    }

    @Test
    @DisplayName("user cannot register if email is taken")
    @DataSet("verifiedUser.yml")
    void userCannotRegisterIfEmailIsTaken() throws Exception {
        //Given
        String email = "test@test.com";
        RegistrationRequest userRequest = new RegistrationRequest(email, "test", "test", "pass", "123", Gender.MALE, false);

        //When
        ResultActions resultActions = performPost(ApiPaths.Users.REGISTER, userRequest);

        //Then
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("forgotten password email is sent")
    @DataSet("verifiedUser.yml")
    void forgottenPasswordEmailIsSent() throws Exception {
        //Given
        ForgottenPasswordRequest forgottenPasswordRequest = new ForgottenPasswordRequest("test@test.com");

        // When
        ResultActions resultActions = performPost(ApiPaths.Users.FORGOTTEN_PASSWORD, forgottenPasswordRequest);

        //Then
        resultActions.andExpect(status().isOk());
    }

    @Test
    @DisplayName("bad id throws 404")
    void badIdThrows404() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(ApiPaths.Users.BASE + "/" + BAD_UUID, Role.ROLE_ADMIN);

        //Then
        resultActions.andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("user can get current user")
    @DataSet("verifiedUser.yml")
    void userCanGetCurrentUser() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(ApiPaths.Users.CURRENT, Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isOk()).andExpect(jsonPath("$.email").value("test@test.com"));
    }

    @Test
    @DisplayName("unauthenticated user cannot get current user")
    void unauthenticatedUserCannotGetCurrentUser() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(ApiPaths.Users.CURRENT);

        //Then
        resultActions.andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("unverified user can be verified")
    @DataSet("notVerifiedUser.yml")
    void unverifiedUserCanBeVerified() throws Exception {
        //Given
        UUID id = UUID.fromString("b7f86506-8ea8-4908-b8f4-668c5ec6a7ee");

        // When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Users.VERIFY, id));
        transaction();

        //Then
        resultActions.andExpect(status().isCreated());
        awaitFor(() -> {
            Optional<User> user = userRepository.findById(id);
            return user.isPresent() && user.get().getVerified();
        });
    }

    @Test
    @DisplayName("verified user cannot be verified")
    @DataSet("verifiedUser.yml")
    void verifiedUserCannotBeVerified() throws Exception {
        //Given
        UUID id = UUID.fromString("b7f86506-8ea8-4908-b8f4-668c5ec6a7ee");

        // When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Users.VERIFY, id));

        //Then
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("unverified user can resend verification email")
    @DataSet("notVerifiedUser.yml")
    void unverifiedUserCanResendVerificationEmail() throws Exception {
        //Given
        EmailRequest emailRequest = new EmailRequest("test@test.com");

        // When
        ResultActions resultActions = performPost(ApiPaths.Users.RESEND_VERIFICATION, emailRequest);
        transaction();

        //Then
        resultActions.andExpect(status().isOk());
    }

    @Test
    @DisplayName("verified user cannot resend verification email")
    @DataSet("verifiedUser.yml")
    void verifiedUserCannotResendVerificationEmail() throws Exception {
        //Given
        EmailRequest emailRequest = new EmailRequest("test@test.com");

        // When
        ResultActions resultActions = performPost(ApiPaths.Users.RESEND_VERIFICATION, emailRequest);

        //Then
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("user can update its password")
    @DataSet("verifiedUser.yml")
    void userCanUpdateItsPassword() throws Exception {
        //Given
        UUID id = UUID.fromString("b7f86506-8ea8-4908-b8f4-668c5ec6a7ee");
        String newPass = "newPass";

        // When
        ResultActions resultActions = performPost(pathWithId(ApiPaths.Users.PASSWORD, id), new NewPasswordRequest(newPass));
        transaction();

        //Then
        resultActions.andExpect(status().isCreated());
        awaitFor(() -> {
            Optional<User> user = userRepository.findById(id);
            return user.isPresent() && user.get().getLastModifiedTime() != null;
        });
        performPost(ApiPaths.Auth.LOGIN, createLoginRequest(newPass)).andExpect(status().isOk());
    }

    @Test
    @DisplayName("user can update its email")
    @DataSet("verifiedUser.yml")
    void userCanUpdateItsEmail() throws Exception {
        //Given
        String email = "new@new.com";
        AddressRequest addressRequest = new AddressRequest("Hungary", 1111, "Budapest", "utca", 2, "2a");
        UpdateUserRequest updateUserRequest = new UpdateUserRequest(email, "first", "last", "111", Gender.MALE, false, addressRequest, addressRequest);

        // When
        ResultActions resultActions = performPut(ApiPaths.Users.UPDATE, updateUserRequest, Role.ROLE_USER);
        transaction();

        //Then
        resultActions.andExpect(status().isOk());
        awaitFor(() -> {
            Optional<User> user = userRepository.findByEmail(email);
            return user.isPresent() && user.get().getLastModifiedTime() != null;
        });
    }

    @Test
    @DisplayName("user can be deleted")
    @DataSet("verifiedUser.yml")
    void userCanBeDeleted() throws Exception {
        //Given // When
        ResultActions resultActions = performDelete(ApiPaths.Users.DELETE, Role.ROLE_USER);
        transaction();

        //Then
        resultActions.andExpect(status().isOk());
        awaitFor(() -> userRepository.findById(UUID.fromString(VERIFIED_USER)).isEmpty());
    }

    @Test
    @DisplayName("user saved items can be retrieved")
    @DataSet("verifiedUserWithSavedAndCartProduct.yml")
    void userSavedItemsCanBeRetrieved() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(ApiPaths.SavedProducts.BASE, Role.ROLE_USER);

        //Then
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$[0].brand.name").value("brand"));
    }

    @Test
    @DisplayName("user cart items can be retrieved")
    @DataSet("verifiedUserWithSavedAndCartProduct.yml")
    void userCartItemsCanBeRetrieved() throws Exception {
        //Given //When
        ResultActions resultActions = performGet(ApiPaths.CartItems.BASE, Role.ROLE_USER);

        //Then
        resultActions
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$[0].product.brand.name").value("brand"))
                .andExpect(jsonPath("$[0].count").value(1));
    }

    @Test
    @DisplayName("user can add a product to saved")
    @DataSet("verifiedUserAndProduct.yml")
    void userCanAddAProductToSaved() throws Exception {
        //Given
        List<UUID> uuids = List.of(UUID.fromString("b7f86506-8ea8-4908-b8f4-668c5ec6a7e1"));

        //When
        ResultActions resultActions = performPost(ApiPaths.SavedProducts.BASE, uuids, Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$[0].brand.name").value("brand"));
    }

    @Test
    @DisplayName("saved can be removed")
    @DataSet("verifiedUserWithSavedAndCartProduct.yml")
    void savedCanBeRemoved() throws Exception {
        //Given
        List<UUID> uuids = List.of(UUID.fromString("b7f86506-8ea8-4908-b8f4-668c5ec6a7e1"));

        //When
        ResultActions resultActions = performDelete(ApiPaths.SavedProducts.BASE, Role.ROLE_USER, uuids);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    @DisplayName("cart can be updated")
    @DataSet("verifiedUserAndProduct.yml")
    void cartCanBeUpdated() throws Exception {
        //Given
        List<CartItemRequest> cartItemRequests = List.of(new CartItemRequest(UUID.fromString("b7f86506-8ea8-4908-b8f4-668c5ec6a7e1"), 2));

        //When
        ResultActions resultActions = performPut(ApiPaths.CartItems.BASE, cartItemRequests, Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isNotEmpty())
                .andExpect(jsonPath("$[0].product.brand.name").value("brand"));
    }

    @Test
    @DisplayName("not enough product results in an exception")
    @DataSet("verifiedUserAndProduct.yml")
    void notEnoughProductResultsInAnException() throws Exception {
        //Given
        List<CartItemRequest> cartItemRequests = List.of(new CartItemRequest(UUID.fromString("b7f86506-8ea8-4908-b8f4-668c5ec6a7e1"), 20));

        //When
        ResultActions resultActions = performPut(ApiPaths.CartItems.BASE, cartItemRequests, Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("user can remove items from cart")
    @DataSet("verifiedUserWithSavedAndCartProduct.yml")
    void userCanRemoveItemsFromCart() throws Exception {
        //Given
        List<CartItemRequest> cartItemRequests = List.of(new CartItemRequest(UUID.fromString("b7f86506-8ea8-4908-b8f4-668c5ec6a7e1"), 0));

        //When
        ResultActions resultActions = performPut(ApiPaths.CartItems.BASE, cartItemRequests, Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].product.brand.name").value("brand"));
    }

    @Test
    @DisplayName("user can increase items in the cart")
    @DataSet("verifiedUserWithSavedAndCartProduct.yml")
    void userCanIncreaseItemsInTheCart() throws Exception {
        //Given
        List<CartItemRequest> cartItemRequests = List.of(new CartItemRequest(UUID.fromString("b7f86506-8ea8-4908-b8f4-668c5ec6a7e1"), 2));

        //When
        ResultActions resultActions = performPut(ApiPaths.CartItems.BASE, cartItemRequests, Role.ROLE_USER);

        //Then
        resultActions.andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].count").value(2));
    }

    @Test
    @DisplayName("unsubscribe from email list by id")
    @DataSet("verifiedUser.yml")
    void unsubscribeFromEmailListById() throws Exception {
        //Given
        String userId = "b7f86506-8ea8-4908-b8f4-668c5ec6a7ee";
        ResultActions resultActions = performGet(pathWithId(ApiPaths.Users.UNSUBSCRIBE, userId));

        //Then
        resultActions
                .andExpect(status().isOk());
        awaitFor(() -> {
            Optional<User> byId = userRepository.findById(UUID.fromString(userId));
            return byId.isPresent() && !byId.get().isSubscribedToEmail();
        });
    }
}
