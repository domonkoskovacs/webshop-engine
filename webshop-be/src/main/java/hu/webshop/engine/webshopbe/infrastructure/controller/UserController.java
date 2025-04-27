package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.UserAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Public;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.User;
import hu.webshop.engine.webshopbe.infrastructure.controller.api.ApiPaths;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CartItemRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.EmailRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ForgottenPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.NewPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.RegistrationRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.UpdateUserRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CartItemResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ProductResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(
        name = "User service",
        description = "REST endpoints for user service"
)
public class UserController {

    private final UserAdapter userAdapter;

    @Operation(
            tags = {"User service"},
            summary = "Registration of new user",
            description = "Users can register with the required information"
    )
    @Public
    @PostMapping(value = ApiPaths.Users.REGISTER,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> register(@Valid @RequestBody RegistrationRequest registration) {
        log.info("register > registration: [{}]", registration);
        userAdapter.register(registration);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(
            tags = {"User service"},
            summary = "New password request",
            description = "Users can request a new password if the old is forgotten"
    )
    @Public
    @PostMapping(value = ApiPaths.Users.FORGOTTEN_PASSWORD,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> forgottenPassword(@Valid @RequestBody ForgottenPasswordRequest forgottenPasswordRequest) {
        log.info("forgottenPassword > forgottenPasswordRequest: [{}]", forgottenPasswordRequest);
        userAdapter.forgottenPassword(forgottenPasswordRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Operation(
            tags = {"User service"},
            summary = "Get current user",
            description = "Current user can be retrieved"
    )
    @GetMapping(value = ApiPaths.Users.CURRENT, produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<UserResponse> getCurrentUser() {
        log.info("getCurrentUser");
        return ResponseEntity.status(HttpStatus.OK).body(userAdapter.getCurrent());
    }

    @Operation(
            tags = {"User service"},
            summary = "Verify an user",
            description = "After registration users must be verified, with a verification link that is given in an email"
    )
    @Public
    @PostMapping(value = ApiPaths.Users.VERIFY,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> verify(@PathVariable UUID id) {
        log.info("verify > id: [{}]", id);
        userAdapter.verify(id);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(
            tags = {"User service"},
            summary = "Resend verification email",
            description = "After registration users can resend the verification email"
    )
    @Public
    @PostMapping(value = ApiPaths.Users.RESEND_VERIFICATION,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> resendVerify(@Valid @RequestBody EmailRequest emailRequest) {
        log.info("resendVerify > emailRequest: [{}]", emailRequest);
        userAdapter.resendVerify(emailRequest);
        return ResponseEntity.ok().build();
    }

    @Operation(
            tags = {"User service"},
            summary = "Update users password",
            description = "Update a user password with a new one"

    )
    @Public
    @PostMapping(value = ApiPaths.Users.PASSWORD,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> newPassword(@PathVariable UUID id, @Valid @RequestBody NewPasswordRequest newPasswordRequest) {
        log.info("newPassword > id: [{}]", id);
        userAdapter.newPassword(id, newPasswordRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(
            tags = {"User service"},
            summary = "Update user",
            description = "Update a users email and/or username"
    )
    @PutMapping(value = ApiPaths.Users.UPDATE,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<UserResponse> updateUser(@Valid @RequestBody UpdateUserRequest user) {
        log.info("updateUser > user: [{}]", user);
        return ResponseEntity.ok(userAdapter.updateUser(user));
    }

    @Operation(
            tags = {"User service"},
            summary = "Delete user",
            description = "Delete a user"
    )
    @DeleteMapping(ApiPaths.Users.DELETE)
    @User
    public ResponseEntity<Void> deleteUser() {
        log.info("deleteUser");
        userAdapter.deleteUser();
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Operation(
            tags = {"User service"},
            summary = "Get saved products",
            description = "Get the users saved products"
    )
    @GetMapping(value = ApiPaths.SavedProducts.BASE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<List<ProductResponse>> getSaved() {
        log.info("getSaved");
        return ResponseEntity.ok().body(userAdapter.getSaved());
    }

    @Operation(
            tags = {"User service"},
            summary = "Get cart products",
            description = "Get the users cart products"
    )
    @GetMapping(value = ApiPaths.CartItems.BASE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<List<CartItemResponse>> getCart() {
        log.info("getCart");
        return ResponseEntity.ok().body(userAdapter.getCart());
    }

    @Operation(
            tags = {"User service"},
            summary = "Add to saved products",
            description = "Add items to users saved products"
    )
    @PostMapping(value = ApiPaths.SavedProducts.BASE,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<List<ProductResponse>> addSaved(@Valid @RequestBody List<UUID> productIds) {
        log.info("addSaved, productIds: [{}]", productIds);
        return ResponseEntity.ok().body(userAdapter.addSaved(productIds));
    }

    @Operation(
            tags = {"User service"},
            summary = "Remove from saved products",
            description = "Remove items to users saved products"
    )
    @DeleteMapping(value = ApiPaths.SavedProducts.BASE,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<List<ProductResponse>> removeSaved(@Valid @RequestBody List<UUID> productIds) {
        log.info("removeSaved, productIds: [{}]", productIds);
        return ResponseEntity.ok().body(userAdapter.removeSaved(productIds));
    }

    @Operation(
            tags = {"User service"},
            summary = "Update cart products",
            description = "Update the users cart products"
    )
    @PutMapping(value = ApiPaths.CartItems.BASE,
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @User
    public ResponseEntity<List<CartItemResponse>> updateCart(@Valid @RequestBody List<CartItemRequest> cartItemRequests) {
        log.info("updateSaved, cartItemRequests: [{}]", cartItemRequests);
        return ResponseEntity.ok().body(userAdapter.updateCart(cartItemRequests));
    }

    @Operation(
            tags = {"User service"},
            summary = "Unsubscribe from email list with email",
            description = "User can unsubscribe from email list with email"
    )
    @Public
    @GetMapping(value = ApiPaths.Users.UNSUBSCRIBE)
    public ResponseEntity<Void> unSubscribeToEmailListWithId(@PathVariable UUID id) {
        log.info("unSubscribeToEmailListWithId > id: [{}]", id);
        userAdapter.unSubscribeToEmailListWithId(id);
        return ResponseEntity.ok().build();
    }
}
