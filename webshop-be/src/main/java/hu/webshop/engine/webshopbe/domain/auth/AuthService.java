package hu.webshop.engine.webshopbe.domain.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.auth.value.Authorization;
import hu.webshop.engine.webshopbe.domain.auth.value.Credentials;
import hu.webshop.engine.webshopbe.domain.auth.value.JwtTokenType;
import hu.webshop.engine.webshopbe.domain.auth.value.Login;
import hu.webshop.engine.webshopbe.domain.base.exception.AuthenticationException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import hu.webshop.engine.webshopbe.domain.user.entity.User;
import hu.webshop.engine.webshopbe.domain.user.value.TokenType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder encoder;

    /**
     * checks if user verified and the credentials matching
     *
     * @param credentials user credentials
     * @return token and login info
     */
    public Login login(Credentials credentials) {
        log.info("login > email: [{}]", credentials.email());
        User user = userService.getByEmail(credentials.email());
        if (!user.isEnabled()) {
            log.error("User is not a verified user, email: [{}]", credentials.email());
            throw new AuthenticationException(ReasonCode.UNVERIFIED_USER, "User is unverified");
        }
        if (encoder.matches(credentials.password(), user.getPassword())) {
            log.info("Login was successful");
            return createLogin(user);
        } else {
            log.error("Password is not correct");
            throw new AuthenticationException(ReasonCode.WRONG_PASSWORD, "Bad Credentials, can't generate tokens");
        }
    }

    private Login createLogin(User user) {
        String role = user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList().get(0);
        String accessToken = jwtService.generateAccessJwtToken(user.getUsername(), user.getEmail(), role);
        String refreshToken = jwtService.generateJwtRefreshToken(user.getUsername(), user.getEmail(), role);
        return (new Login(accessToken, jwtService.getAccessJwtExpiration(), refreshToken, jwtService.getRefreshJwtExpiration(), TokenType.BEARER.toString(), role));
    }

    /**
     * refreshes access token after validating refresh token
     *
     * @param token refresh token
     * @return token and login info
     */
    public Login refreshToken(String token) {
        log.info("refreshToken");
        jwtService.validateRefreshToken(token);
        String email = jwtService.getEmailFromRefreshJwtToken(token);
        User user = userService.getByEmail(email);
        log.info("Refreshing access token was successful");
        return createLogin(user);
    }

    /**
     * validates token and creates token info
     *
     * @param token access ot refresh token
     * @return token info
     */
    public Authorization authorize(String token) {
        log.info("authorize > token: [{}]", token);
        JwtTokenType tokenType = jwtService.getJwtTokenType(token);
        jwtService.validateJwtToken(token, tokenType);
        log.info("[{}] token is valid", tokenType);
        User user = userService.getByEmail(jwtService.getEmailFromToken(token, tokenType));
        return new Authorization(user.getId().toString(), user.getRole(), tokenType);
    }
}
