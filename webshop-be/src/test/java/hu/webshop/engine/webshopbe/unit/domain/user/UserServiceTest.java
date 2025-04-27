package hu.webshop.engine.webshopbe.unit.domain.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import hu.webshop.engine.webshopbe.domain.base.exception.AuthenticationException;
import hu.webshop.engine.webshopbe.domain.email.EmailService;
import hu.webshop.engine.webshopbe.domain.product.ProductService;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
@DisplayName("User service unit tests")
class UserServiceTest {

    @InjectMocks
    private UserService userService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ProductService productService;
    @Mock
    private EmailService emailService;
    @Mock
    private PasswordEncoder encoder;

    @Test
    @DisplayName("current user throws exception if auth context is empty")
    void currentUserThrowsExceptionIfAuthContextIsEmpty() {
        //Given //When //Then
        assertThatThrownBy(() -> userService.getCurrentUser()).isInstanceOf(AuthenticationException.class);
    }

    @Test
    @DisplayName("get subscribed is correct")
    void getSubscribedIsCorrect() {
        //Given
        when(userRepository.findAllBySubscribedToEmail(true)).thenReturn(List.of(User.builder().build()));

        //When
        List<User> subscribedUsers = userService.getSubscribedUsers();

        //Then
        assertThat(subscribedUsers).hasSizeGreaterThan(0);
    }
    
    @Test
    @DisplayName("load user throws exception when not found")
    void loadUserThrowsExceptionWhenNotFound() {
        //Given
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());


        //When //Then
        assertThatThrownBy(() -> userService.loadUserByUsername(email))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("User was not found");
    }
}
