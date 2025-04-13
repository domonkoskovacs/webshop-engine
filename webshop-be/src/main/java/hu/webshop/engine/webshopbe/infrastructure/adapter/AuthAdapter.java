package hu.webshop.engine.webshopbe.infrastructure.adapter;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hu.webshop.engine.webshopbe.domain.auth.AuthService;
import hu.webshop.engine.webshopbe.infrastructure.adapter.mapper.AuthMapper;
import hu.webshop.engine.webshopbe.infrastructure.model.request.LoginRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.LoginResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthAdapter {

    private final AuthService authService;
    private final AuthMapper authMapper;

    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        log.info("login > loginRequest: [{}]", loginRequest);
        return authMapper.toResponse(authService.login(authMapper.fromRequest(loginRequest)));
    }

    public LoginResponse refreshToken(String token) {
        log.info("refreshToken > token: [{}]", token);
        return authMapper.toResponse(authService.refreshToken(token));
    }
}
