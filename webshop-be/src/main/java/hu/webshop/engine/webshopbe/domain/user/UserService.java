package hu.webshop.engine.webshopbe.domain.user;


import static hu.webshop.engine.webshopbe.domain.user.value.Role.ROLE_USER;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.auth.value.ForgottenPassword;
import hu.webshop.engine.webshopbe.domain.base.exception.AuthenticationException;
import hu.webshop.engine.webshopbe.domain.base.exception.ProductException;
import hu.webshop.engine.webshopbe.domain.base.exception.RegistrationException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Cart;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.user.repository.UserRepository;
import hu.webshop.engine.webshopbe.domain.user.value.CartItem;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.domain.user.value.UpdateUser;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final ProductService productService;
    private final EmailService emailService;
    private final PasswordEncoder encoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("loadUserByUsername > username: [{}]", username);
        return userRepository.findByEmail(username).orElseThrow(this::entityNotFoundException);
    }

    private EntityNotFoundException entityNotFoundException() {
        return new EntityNotFoundException("User was not found");
    }

    /**
     * registers a user
     *
     * @param registration user info
     */
    public void register(User registration) {
        log.info("register > registration: [{}]", registration);
        if (isEmailOccupied(registration.getEmail())) {
            log.error("Email address is already taken");
            throw new RegistrationException(ReasonCode.EMAIL_TAKEN, "Error: Email is already in use!");
        }
        User user = create(registration);
        emailService.sendRegistrationMail(user);
        log.info("User registered successfully");
    }

    public boolean isEmailOccupied(String email) {
        log.info("isEmailOccupied > email: [{}]", email);
        return Boolean.TRUE.equals(userRepository.existsByEmail(email));
    }

    public User create(User registration) {
        log.info("create > registration: [{}]", registration.getId());
        registration.setVerified(false);
        registration.setRole(ROLE_USER);
        registration.setPassword(encoder.encode(registration.getPassword()));
        return userRepository.save(registration);
    }

    /**
     * sends forgotten password email
     *
     * @param forgottenPassword email
     */
    public void forgottenPassword(ForgottenPassword forgottenPassword) {
        log.info("forgottenPassword: forgottenPassword: [{}]", forgottenPassword);
        if (isEmailOccupied(forgottenPassword.email())) {
            log.debug("User found for forgotten password email: [{}]", forgottenPassword.email());
            emailService.sendForgottenPasswordEmail(forgottenPassword.email(), getByEmail(forgottenPassword.email()).getId());
        }
    }

    public User getByEmail(String email) {
        log.info("getByEmail > email: [{}]", email);
        return userRepository.findByEmail(email).orElseThrow(() -> new AuthenticationException(ReasonCode.EMAIL_NOT_EXISTS, "Email not exists"));
    }

    public List<User> getUsers() {
        log.info("getUsers");
        return userRepository.findAll();
    }

    public long getCountByRole(Role role) {
        log.info("getCountByRole > role: [{}]", role);
        return userRepository.countByRole(role);
    }

    public void initUser(User user) {
        log.info("initUser > user: [{}]", user);
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void verify(UUID id) {
        log.info("verify > id: [{}]", id);
        User user = userRepository.findById(id).orElseThrow(this::entityNotFoundException);
        if (!Boolean.TRUE.equals(user.getVerified())) {
            user.setVerified(true);
            userRepository.save(user);
        } else {
            throw new RegistrationException(ReasonCode.ALREADY_VERIFIED_USER, "Email is already verified");
        }
    }

    public void updatePassword(UUID id, String password) {
        log.info("updatePassword");
        User user = userRepository.findById(id).orElseThrow(this::entityNotFoundException);
        user.setPassword(encoder.encode(password));
        userRepository.save(user);
    }

    public User update(UpdateUser updateUser) {
        log.info("update > updateUser: [{}]", updateUser);
        User user = getCurrentUser();
        user.setEmail(updateUser.email());
        user.setFirstname(updateUser.firstname());
        user.setLastname(updateUser.lastname());
        user.setPhoneNumber(updateUser.phoneNumber());
        if (updateUser.gender() != null) user.setGender(updateUser.gender());
        if (updateUser.subscribedToEmail() != null) user.setSubscribedToEmail(updateUser.subscribedToEmail());
        if (updateUser.shippingAddress() != null && !updateUser.shippingAddress().equals(user.getShippingAddress()))
            user.setShippingAddress(updateUser.shippingAddress());
        if (updateUser.billingAddress() != null && !updateUser.billingAddress().equals(user.getBillingAddress()))
            user.setBillingAddress(updateUser.billingAddress());
        return userRepository.save(user);
    }

    public User getCurrentUser() {
        log.info("getCurrentUser");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAuthenticated = authentication != null && authentication.isAuthenticated();
        if (isAuthenticated) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return getByEmail(userDetails.getUsername());
        } else {
            throw new AuthenticationException(ReasonCode.UNAUTHENTICATED_USER, "User is not authenticated");
        }
    }

    public void delete() {
        log.info("delete");
        userRepository.delete(getCurrentUser());
    }

    public List<Product> getSaved() {
        log.info("getSaved");
        return getCurrentUser().getSaved();
    }

    public List<Cart> getCart() {
        log.info("getCart");
        return getCurrentUser().getCart();
    }

    public List<Product> addSaved(List<UUID> productIds) {
        log.info("addSaved > productIds: [{}]", productIds);
        User currentUser = getCurrentUser();
        List<Product> existingSaved = currentUser.getSaved();
        List<Product> productsToAdd = productService.getAll(productIds)
                .stream()
                .filter(product -> existingSaved.stream().noneMatch(saved -> saved.getId().equals(product.getId())))
                .toList();

        currentUser.addSaved(productsToAdd);
        userRepository.save(currentUser);
        return currentUser.getSaved();
    }


    public List<Product> removeSaved(List<UUID> productIds) {
        log.info("removeSaved > productIds: [{}]", productIds);
        User currentUser = getCurrentUser();
        currentUser.removeSaved(productService.getAll(productIds));
        userRepository.save(currentUser);
        return currentUser.getSaved();
    }

    public List<Cart> updateCart(List<CartItem> cartItems) {
        log.info("updateCart, cartItems: [{}]", cartItems);
        User currentUser = getCurrentUser();
        List<Cart> existingCarts = currentUser.getCart();
        Map<UUID, Cart> existingCartMap = existingCarts.stream()
                .collect(Collectors.toMap(cart -> cart.getProduct().getId(), cart -> cart));

        for (CartItem cartItem : cartItems) {
            Cart existingCart = existingCartMap.get(cartItem.productId());

            Product product = productService.getById(cartItem.productId());
            if (cartItem.count() > product.getCount()) {
                throw new ProductException(ReasonCode.NOT_ENOUGH_PRODUCT_IN_STOCK, "Not enough stock for product: " + cartItem.productId());
            }

            if (cartItem.count() == 0 && existingCart != null) {
                currentUser.removeCart(existingCart);
            } else if (cartItem.count() > 0) {
                if (existingCart != null) {
                    existingCart.setCount(cartItem.count());
                } else {
                    Cart newCart = mapCart(cartItem);
                    currentUser.addCart(newCart);
                }
            }
        }

        userRepository.save(currentUser);
        return existingCarts;
    }

    private Cart mapCart(CartItem cartItem) {
        return Cart.builder()
                .count(cartItem.count())
                .product(productService.getById(cartItem.productId()))
                .build();
    }

    public void clearCart() {
        log.info("clearCart");
        User currentUser = getCurrentUser();
        currentUser.clearCart();
        userRepository.save(currentUser);
    }

    public void unSubscribeToEmailListWithId(UUID id) {
        User byId = getById(id);
        byId.setSubscribedToEmail(false);
        userRepository.save(byId);
    }

    public User getById(UUID uuid) {
        log.info("getById > uuid: [{}]", uuid);
        return userRepository.findById(uuid).orElseThrow(this::entityNotFoundException);
    }

    public List<User> getSubscribedUsers() {
        return userRepository.findAllBySubscribedToEmail(true);
    }

    public void resendVerify(@Email String email) {
        log.info("resendVerify > email: [{}]", email);
        User user = getByEmail(email);
        if (!Boolean.TRUE.equals(user.getVerified())) {
            emailService.sendRegistrationMail(user);
        } else {
            throw new RegistrationException(ReasonCode.ALREADY_VERIFIED_USER, "Email is already verified");
        }
    }
}
