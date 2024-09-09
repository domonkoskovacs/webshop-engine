package hu.webshop.engine.webshopbe.infrastructure.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hu.webshop.engine.webshopbe.infrastructure.adapter.UserAdapter;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.Admin;
import hu.webshop.engine.webshopbe.infrastructure.config.annotations.User;
import hu.webshop.engine.webshopbe.infrastructure.model.request.AddressRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CartItemRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ForgottenPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.NewPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.RegistrationRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.UpdateUserRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.VerificationRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CartItemResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.OrderResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ProductResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/user")
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
    @PostMapping(value = "/register", consumes = "application/json", produces = "application/json")
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
    @PostMapping(value = "/forgotten/password", consumes = "application/json")
    public ResponseEntity<Void> forgottenPassword(@Valid @RequestBody ForgottenPasswordRequest forgottenPasswordRequest) {
        log.info("forgottenPassword > forgottenPasswordRequest: [{}]", forgottenPasswordRequest);
        userAdapter.forgottenPassword(forgottenPasswordRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Operation(
            tags = {"User service"},
            summary = "Get users",
            description = "Users can be retrieved"
    )
    @GetMapping(produces = "application/json")
    @Admin
    public ResponseEntity<List<UserResponse>> getUsers() {
        log.info("getUsers");
        return ResponseEntity.status(HttpStatus.OK).body(userAdapter.getUsers());
    }

    @Operation(
            tags = {"User service"},
            summary = "Get user",
            description = "User can be retrieved by an id with an admin"
    )
    @GetMapping(value = "/{id}", produces = "application/json")
    @Admin
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        log.info("getUserById > id: [{}]", id);
        return ResponseEntity.status(HttpStatus.OK).body(userAdapter.getById(id));
    }

    @Operation(
            tags = {"User service"},
            summary = "Get current user",
            description = "Current user can be retrieved"
    )
    @GetMapping(value = "/current", produces = "application/json")
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
    @PostMapping(value = "/verify", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Void> verify(@Valid @RequestBody VerificationRequest verificationRequest) {
        log.info("verify > verificationRequest: [{}]", verificationRequest);
        userAdapter.verify(verificationRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(
            tags = {"User service"},
            summary = "Update users password",
            description = "Update a user password with a new one"

    )
    @PostMapping(value = "/new/password", consumes = "application/json")
    public ResponseEntity<Void> newPassword(@Valid @RequestBody NewPasswordRequest newPasswordRequest) {
        log.info("newPassword > newPasswordRequest: [{}]", newPasswordRequest);
        userAdapter.newPassword(newPasswordRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(
            tags = {"User service"},
            summary = "Update user",
            description = "Update a users email and/or username"
    )
    @PostMapping(value = "/update", consumes = "application/json", produces = "application/json")
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
    @DeleteMapping(value = "/delete")
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
    @GetMapping(value = "/saved", produces = "application/json")
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
    @GetMapping(value = "/cart", produces = "application/json")
    @User
    public ResponseEntity<List<CartItemResponse>> getCart() {
        log.info("getCart");
        return ResponseEntity.ok().body(userAdapter.getCart());
    }

    @Operation(
            tags = {"User service"},
            summary = "Get orders",
            description = "Get the orders for the user"
    )
    @GetMapping(value = "/order", produces = "application/json")
    @User
    public ResponseEntity<List<OrderResponse>> getOrders() {
        log.info("getOrders");
        return ResponseEntity.ok().body(userAdapter.getOrders());
    }

    @Operation(
            tags = {"User service"},
            summary = "Add to saved products",
            description = "Add items to users saved products"
    )
    @PostMapping(value = "/add/saved", consumes = "application/json", produces = "application/json")
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
    @PostMapping(value = "/remove/saved", consumes = "application/json", produces = "application/json")
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
    @PostMapping(value = "/update/cart", consumes = "application/json", produces = "application/json")
    @User
    public ResponseEntity<List<CartItemResponse>> updateCart(@Valid @RequestBody List<CartItemRequest> cartItemRequests) {
        log.info("updateSaved, cartItemRequests: [{}]", cartItemRequests);
        return ResponseEntity.ok().body(userAdapter.updateCart(cartItemRequests));
    }

    @Operation(
            tags = {"User service"},
            summary = "Add shipping address",
            description = "Add a shipping address to a user"
    )
    @PostMapping(value = "/address/shipping", consumes = "application/json", produces = "application/json")
    @User
    public ResponseEntity<UserResponse> addShippingAddress(@Valid @RequestBody AddressRequest addressRequest) {
        log.info("addShippingAddress, addressRequest: [{}]", addressRequest);
        return ResponseEntity.ok().body(userAdapter.addShippingAddress(addressRequest));
    }

    @Operation(
            tags = {"User service"},
            summary = "Add billing address",
            description = "Add a billing address to a user"
    )
    @PostMapping(value = "/address/billing", consumes = "application/json", produces = "application/json")
    @User
    public ResponseEntity<UserResponse> addBillingAddress(@Valid @RequestBody AddressRequest addressRequest) {
        log.info("addShippingAddress, addressRequest: [{}]", addressRequest);
        return ResponseEntity.ok().body(userAdapter.addBillingAddress(addressRequest));
    }

    @Operation(
            tags = {"User service"},
            summary = "Subscribe to email list",
            description = "User can subscribe to email list"
    )
    @GetMapping(value = "/subscribe")
    @User
    public ResponseEntity<UserResponse> subscribeToEmailList() {
        log.info("subscribeToEmailList");
        return ResponseEntity.ok(userAdapter.subscribeToEmailList());
    }

    @Operation(
            tags = {"User service"},
            summary = "Unsubscribe from email list",
            description = "User can unsubscribe from email list"
    )
    @GetMapping(value = "/unsubscribe")
    @User
    public ResponseEntity<UserResponse> unSubscribeToEmailList() {
        log.info("unSubscribeToEmailList");
        return ResponseEntity.ok(userAdapter.unSubscribeToEmailList());
    }

    @Operation(
            tags = {"User service"},
            summary = "Unsubscribe from email list with email",
            description = "User can unsubscribe from email list with email"
    )
    @GetMapping(value = "/unsubscribe/{id}")
    public ResponseEntity<Void> unSubscribeToEmailListWithId(@PathVariable UUID id) {
        log.info("unSubscribeToEmailListWithId > id: [{}]", id);
        userAdapter.unSubscribeToEmailListWithId(id);
        return ResponseEntity.ok().build();
    }
}
