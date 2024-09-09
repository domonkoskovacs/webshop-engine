package hu.webshop.engine.webshopbe.unit.domain.user;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.user.value.Role;

@DisplayName("User entity tests")
class UserTest {

    @Test
    @DisplayName("user details correct")
    void userDetailsCorrect() {
        //Given
        User user = User.builder().email("email").firstname("first")
                .lastname("last").password("pass").role(Role.ROLE_ADMIN).verified(true).phoneNumber("123").build();

        //When
        boolean isAccountNonExpired = user.isAccountNonExpired();
        boolean isAccountNonLocked = user.isAccountNonLocked();
        boolean isCredentialsNonExpired = user.isCredentialsNonExpired();

        //Then
        assertThat(isAccountNonExpired).isTrue();
        assertThat(isAccountNonLocked).isTrue();
        assertThat(isCredentialsNonExpired).isTrue();
    }
}
