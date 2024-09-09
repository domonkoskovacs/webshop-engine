package hu.webshop.engine.webshopbe.domain.user;


import static hu.webshop.engine.webshopbe.domain.user.value.Role.ROLE_USER;

import java.util.List;
import java.util.UUID;

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
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.product.entity.Cart;
import hu.webshop.engine.webshopbe.domain.product.entity.Product;
import hu.webshop.engine.webshopbe.domain.user.entity.Address;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.user.repository.UserRepository;
import hu.webshop.engine.webshopbe.domain.user.value.CartItem;
import hu.webshop.engine.webshopbe.domain.user.value.NewPassword;
import hu.webshop.engine.webshopbe.domain.user.value.Role;
import hu.webshop.engine.webshopbe.domain.user.value.UpdateUser;
import hu.webshop.engine.webshopbe.domain.user.value.Verification;
import jakarta.persistence.EntityNotFoundException;
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
        log.info("create > registration: [{}]", registration);
        log.info("create > registration: [{}]", registration);
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
            emailService.sendForgottenPasswordEmail(forgottenPassword.email(), getByEmail(forgottenPassword.email()).getId());
        } else {
            throw new EntityNotFoundException("Email not found");
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

    public void verify(Verification verification) {
        log.info("verify > verification: [{}]", verification);
        log.info("verify > verification: [{}]", verification);
        User user = userRepository.findById(verification.id()).orElseThrow(this::entityNotFoundException);
        user.setVerified(true);
        userRepository.save(user);
    }

    public void updatePassword(NewPassword newPassword) {
        log.info("updatePassword");
        User user = userRepository.findById(newPassword.id()).orElseThrow(this::entityNotFoundException);
        user.setPassword(encoder.encode(newPassword.password()));
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
        log.info("updateCart, productIds: [{}]", productIds);
        User currentUser = getCurrentUser();
        currentUser.addSaved(productService.getAll(productIds));
        userRepository.save(currentUser);
        return currentUser.getSaved();
    }

    public List<Product> removeSaved(List<UUID> productIds) {
        log.info("updateCart, productIds: [{}]", productIds);
        User currentUser = getCurrentUser();
        currentUser.removeSaved(productService.getAll(productIds));
        userRepository.save(currentUser);
        return currentUser.getSaved();
    }

    public List<Cart> updateCart(List<CartItem> cartItems) {
        log.info("updateCart, cartItems: [{}]", cartItems);
        User currentUser = getCurrentUser();
        currentUser.updateCart(createCarts(cartItems));
        userRepository.save(currentUser);
        return currentUser.getCart();
    }

    private List<Cart> createCarts(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(this::mapCart)
                .toList();
    }

    private Cart mapCart(CartItem cartItem) {
        Product product = productService.getById(cartItem.productId());
        if (product.getCount() < cartItem.count())
            throw new ProductException(ReasonCode.NOT_ENOUGH_PRODUCT_IN_STOCK, String.format("There is not enough product: product: [%s]", product.getFullProductName()));
        return Cart.builder()
                .count(cartItem.count())
                .product(productService.getById(cartItem.productId()))
                .build();
    }

    public User assignShippingAddress(Address address) {
        log.info("assignShippingAddress, address: [{}]", address);
        User currentUser = getCurrentUser();
        currentUser.assignShippingAddress(address);
        return userRepository.save(currentUser);
    }

    public User assignBillingAddress(Address address) {
        log.info("assignBillingAddress, address: [{}]", address);
        User currentUser = getCurrentUser();
        currentUser.assignBillingAddress(address);
        return userRepository.save(currentUser);
    }

    public void clearCart() {
        log.info("clearCart");
        User currentUser = getCurrentUser();
        currentUser.clearCart();
        userRepository.save(currentUser);
    }

    public List<Order> getOrders() {
        log.info("getOrders");
        return getCurrentUser().getOrders();
    }

    public User subscribeToEmailList() {
        log.info("subscribeToEmailList");
        User currentUser = getCurrentUser();
        currentUser.subscribeToEmailList();
        return userRepository.save(currentUser);
    }

    public User unSubscribeToEmailList() {
        log.info("unSubscribeToEmailList");
        User currentUser = getCurrentUser();
        currentUser.unSubscribeToEmailList();
        return userRepository.save(currentUser);
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
}
