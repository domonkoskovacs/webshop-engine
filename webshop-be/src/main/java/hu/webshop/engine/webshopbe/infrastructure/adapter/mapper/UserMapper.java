package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import hu.webshop.engine.webshopbe.domain.auth.value.ForgottenPassword;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.user.value.NewPassword;
import hu.webshop.engine.webshopbe.domain.user.value.UpdateUser;
import hu.webshop.engine.webshopbe.domain.user.value.Verification;
import hu.webshop.engine.webshopbe.infrastructure.model.request.ForgottenPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.NewPasswordRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.RegistrationRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.UpdateUserRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.request.VerificationRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.UserResponse;

@Mapper(uses = {AddressMapper.class, CartMapper.class, ProductMapper.class, OrderMapper.class})
public interface UserMapper {
    UserResponse toResponse(User entity);

    List<UserResponse> toResponseList(List<User> entities);

    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "shippingAddress", ignore = true)
    @Mapping(target = "saved", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "billingAddress", ignore = true)
    User fromRequest(RegistrationRequest request);

    Verification fromRequest(VerificationRequest request);

    NewPassword fromRequest(NewPasswordRequest request);

    UpdateUser fromRequest(UpdateUserRequest request);

    ForgottenPassword fromRequest(ForgottenPasswordRequest request);
}
