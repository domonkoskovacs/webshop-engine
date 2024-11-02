package hu.webshop.engine.webshopbe.infrastructure.adapter;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.auth.AuthService;
import hu.webshop.engine.webshopbe.domain.auth.value.Login;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.AuthMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.LoginRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.AuthorizationResponse;
import hu.webshop.engine.webshopbe.infrastructure.model.response.LoginResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthAdapter {

    private final AuthService authService;
    private final AuthMapper authMapper;

    @Transactional
    public LoginResponse login(LoginRequest loginRequest, HttpServletResponse response) {
        log.info("login > loginRequest: [{}]", loginRequest);
        Login login = authService.login(authMapper.fromRequest(loginRequest));
        LoginResponse loginResponse = authMapper.toResponse(login);
        response.addCookie(getCookie(login.refreshToken(), (int) login.refreshTokenTimeout()));
        return loginResponse;
    }

    private static Cookie getCookie(String refreshToken, int timeout) {
        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setSecure(true);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setPath("/refreshToken");
        refreshCookie.setMaxAge(timeout);
        return refreshCookie;
    }

    public LoginResponse refreshToken(String token) {
        log.info("refreshToken > token: [{}]", token);
        return authMapper.toResponse(authService.refreshToken(token));
    }

    public AuthorizationResponse authorize(String token) {
        log.info("authorize > token: [{}]", token);
        return authMapper.toResponse(authService.authorize(token));
    }

    public void logout(HttpServletResponse response) {
        log.info("logout");
        response.addCookie(getCookie(null, 0));
    }
}
