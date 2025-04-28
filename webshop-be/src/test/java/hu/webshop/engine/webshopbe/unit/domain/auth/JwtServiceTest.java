package hu.webshop.engine.webshopbe.unit.domain.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.when;

import java.security.Key;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;

import hu.webshop.engine.webshopbe.domain.auth.JwtService;
import hu.webshop.engine.webshopbe.domain.auth.properties.JwtProperties;
import hu.webshop.engine.webshopbe.domain.auth.value.JwtTokenType;
import hu.webshop.engine.webshopbe.domain.base.exception.AuthenticationException;
import io.jsonwebtoken.security.Keys;

@ExtendWith(MockitoExtension.class)
@DisplayName("Jwt service unit tests")
class JwtServiceTest {

    @Mock
    private JwtProperties jwtProperties;

    @InjectMocks
    private JwtService jwtService;

    private final Key key = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);

    @Test
    @DisplayName("test if token type retrievable when jwt is access token")
    void testIfTokenTypeRetrievableWhenJwtIsAccessToken() {
        //Given
        when(jwtProperties.getExpiration()).thenReturn(86400000);
        when(jwtProperties.getAccessKey()).thenReturn(key);
        String accessToken = jwtService.generateAccessJwtToken("username", "email@email.com", "role");

        //When
        boolean isAccessToken = jwtService.isValidAccessToken(accessToken);

        //Then
        assertThat(isAccessToken).isTrue();
    }

    @Test
    @DisplayName("test if token type retrievable when jwt is refresh token")
    void testIfTokenTypeRetrievableWhenJwtIsRefreshToken() {
        //Given
        when(jwtProperties.getRefreshExpiration()).thenReturn(864000000);
        when(jwtProperties.getRefreshKey()).thenReturn(key);
        String accessToken = jwtService.generateJwtRefreshToken("username", "email@email.com", "role");

        //When
        boolean isAccessToken = jwtService.isValidAccessToken(accessToken);

        //Then
        assertThat(isAccessToken).isFalse();
    }

    @Test
    @DisplayName("test that expired token is not a valid token")
    void testThatExpiredTokenTypeIsNotRetrievable() {
        //Given
        when(jwtProperties.getExpiration()).thenReturn(0);
        when(jwtProperties.getAccessKey()).thenReturn(key);
        String accessToken = jwtService.generateAccessJwtToken("username", "email@email.com", "role");

        //When //Then
        assertThat(jwtService.isValidAccessToken(accessToken)).isFalse();
    }

    @Test
    @DisplayName("test that email is retrievable from access token")
    void testThatEmailIsRetrievableFromAccessToken() {
        //Given
        when(jwtProperties.getExpiration()).thenReturn(10000);
        when(jwtProperties.getAccessKey()).thenReturn(key);
        String email = "email@email.com";
        String accessToken = jwtService.generateAccessJwtToken("username", email, "role");

        //When
        String retrievedEmail = jwtService.getEmailFromAccessJwtToken(accessToken);

        //Then
        assertThat(retrievedEmail).isEqualTo(email);
    }

    @Test
    @DisplayName("test that email is retrievable from refresh token")
    void testThatEmailIsRetrievableFromRefreshToken() {
        //Given
        when(jwtProperties.getRefreshExpiration()).thenReturn(10000);
        when(jwtProperties.getRefreshKey()).thenReturn(key);
        String email = "email@email.com";
        String accessToken = jwtService.generateJwtRefreshToken("username", email, "role");

        //When
        String retrievedEmail = jwtService.getEmailFromRefreshJwtToken(accessToken);

        //Then
        assertThat(retrievedEmail).isEqualTo(email);
    }

    @Test
    @DisplayName("test that access token can be validated")
    void testThatAccessTokenCanBeValidated() {
        //Given
        when(jwtProperties.getExpiration()).thenReturn(86400000);
        when(jwtProperties.getAccessKey()).thenReturn(key);
        String accessToken = jwtService.generateAccessJwtToken("username", "email@email.com", "role");

        //When
        boolean isAccessToken = jwtService.validateJwtToken(accessToken, JwtTokenType.ACCESS_TOKEN);

        //Then
        assertThat(isAccessToken).isTrue();
    }

    @Test
    @DisplayName("test that refresh token can be validated")
    void testThatRefreshTokenCanBeValidated() {
        //Given
        when(jwtProperties.getRefreshExpiration()).thenReturn(86400000);
        when(jwtProperties.getRefreshKey()).thenReturn(key);
        String refreshToken = jwtService.generateJwtRefreshToken("username", "email@email.com", "role");

        //When
        boolean isAccessToken = jwtService.validateJwtToken(refreshToken, JwtTokenType.REFRESH_TOKEN);

        //Then
        assertThat(isAccessToken).isTrue();
    }

    @Test
    @DisplayName("invalid token gives back invalid token type")
    void invalidTokenGivesBackInvalidTokenType() {
        //Given
        String token = "invalidToken";

        //When
        JwtTokenType tokenType = jwtService.getJwtTokenType(token);

        //Then
        assertThat(tokenType).isEqualTo(JwtTokenType.INVALID_TOKEN);
    }

    @Test
    @DisplayName("invalid refresh token gives back false")
    void invalidRefreshTokenGivesBackFalse() {
        //Given
        String token = "token";

        //When
        boolean isValidRefreshToken = jwtService.isValidRefreshToken(token);

        //Then
        assertThat(isValidRefreshToken).isFalse();
    }

    @Test
    @DisplayName("expired refresh token throws exception")
    void expiredRefreshTokenThrowsException() {
        //Given
        when(jwtProperties.getRefreshExpiration()).thenReturn(0);
        when(jwtProperties.getRefreshKey()).thenReturn(key);
        String refreshToken = jwtService.generateJwtRefreshToken("username", "email@email.com", "role");

        //When //Then
        assertThatThrownBy(() -> jwtService.validateRefreshToken(refreshToken))
                .isInstanceOf(AuthenticationException.class);
    }

    @Test
    @DisplayName("invalid token is not a valid refresh token")
    void invalidTokenIsNotAValidRefreshToken() {
        //Given
        String refreshToken = "invalid";

        //When //Then
        assertThatThrownBy(() -> jwtService.validateRefreshToken(refreshToken))
                .isInstanceOf(AuthenticationException.class);
    }

    @Test
    @DisplayName("invalid token cant be validated")
    void invalidTokenCantBeValidated() {
        //Given
        String token = "invalid";

        //When //Then
        assertThatThrownBy(() -> jwtService.validateJwtToken(token, JwtTokenType.ACCESS_TOKEN))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    @DisplayName("expired token cant be validated")
    void expiredTokenCantBeValidated() {
        //Given
        when(jwtProperties.getExpiration()).thenReturn(0);
        when(jwtProperties.getAccessKey()).thenReturn(key);
        String token = jwtService.generateAccessJwtToken("username", "email@email.com", "role");

        //When //Then
        assertThatThrownBy(() -> jwtService.validateJwtToken(token, JwtTokenType.ACCESS_TOKEN))
                .isInstanceOf(AuthenticationException.class);
    }

    @Test
    @DisplayName("isValidRefreshToken returns true for valid refresh token")
    void isValidRefreshTokenReturnsTrueForValidRefreshToken() {
        //Given
        when(jwtProperties.getRefreshKey()).thenReturn(key);
        when(jwtProperties.getRefreshExpiration()).thenReturn(3600000);
        String refreshToken = jwtService.generateJwtRefreshToken("username", "email@email.com", "ROLE_USER");

        //When
        boolean isValid = jwtService.isValidRefreshToken(refreshToken);

        //Then
        assertThat(isValid).isTrue();
    }
}
