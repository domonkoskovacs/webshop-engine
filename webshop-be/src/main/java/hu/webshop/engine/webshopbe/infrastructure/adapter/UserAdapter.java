package hu.webshop.engine.webshopbe.infrastructure.adapter;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.CartMapper;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.ProductMapper;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.UserMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.CartItemRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.EmailRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ForgottenPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.NewPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.RegistrationRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.UpdateUserRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.CartItemResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.ProductResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserAdapter {

    private final UserService userService;
    private final UserMapper userMapper;
    private final ProductMapper productMapper;
    private final CartMapper cartMapper;

    @Transactional
    public void register(RegistrationRequest registration) {
        log.info("register > registration: [{}]", registration);
        userService.register(userMapper.fromRequest(registration));
    }

    public void forgottenPassword(ForgottenPasswordRequest forgottenPasswordRequest) {
        log.info("forgottenPassword > forgottenPasswordRequest: [{}]", forgottenPasswordRequest);
        userService.forgottenPassword(userMapper.fromRequest(forgottenPasswordRequest));
    }

    public UserResponse getCurrent() {
        log.info("getCurrent");
        return userMapper.toResponse(userService.getCurrentUser());
    }

    public void verify(UUID id) {
        log.info("verify > id: [{}]", id);
        userService.verify(id);
    }

    public void newPassword(UUID id, NewPasswordRequest newPasswordRequest) {
        log.info("newPassword > id: [{}]", id);
        userService.updatePassword(id, newPasswordRequest.password());
    }

    public UserResponse updateUser(UpdateUserRequest user) {
        log.info("updateUser > user: [{}]", user);
        return userMapper.toResponse(userService.update(userMapper.fromRequest(user)));
    }

    public void deleteUser() {
        log.info("deleteUser");
        userService.delete();
    }

    public List<ProductResponse> getSaved() {
        log.info("getSaved");
        return productMapper.toResponseList(userService.getSaved());
    }

    public List<CartItemResponse> getCart() {
        log.info("getCart");
        return cartMapper.toResponseList(userService.getCart());
    }

    public List<ProductResponse> addSaved(List<UUID> productIds) {
        log.info("addSaved > productIds: [{}]", productIds);
        return productMapper.toResponseList(userService.addSaved(productIds));
    }

    public List<ProductResponse> removeSaved(List<UUID> productIds) {
        log.info("removeSaved > productIds: [{}]", productIds);
        return productMapper.toResponseList(userService.removeSaved(productIds));
    }

    public List<CartItemResponse> updateCart(List<CartItemRequest> cartItemRequests) {
        log.info("updateCart > cartItemRequests: [{}]", cartItemRequests);
        return cartMapper.toResponseList(userService.updateCart(cartMapper.fromRequestList(cartItemRequests)));
    }

    public void unSubscribeToEmailListWithId(UUID id) {
        log.info("unSubscribeToEmailListWithId > id: [{}]", id);
        userService.unSubscribeToEmailListWithId(id);
    }

    public void resendVerify(@Valid EmailRequest emailRequest) {
        log.info("resendVerify > emailRequest: [{}]", emailRequest);
        userService.resendVerify(emailRequest.email());
    }
}
