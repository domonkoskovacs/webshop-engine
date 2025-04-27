package hu.webshop.engine.webshopbe.domain.auth;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import hu.webshop.engine.webshopbe.domain.auth.properties.JwtProperties;
import hu.webshop.engine.webshopbe.domain.auth.value.JwtTokenClaims;
import hu.webshop.engine.webshopbe.domain.auth.value.JwtTokenType;
import hu.webshop.engine.webshopbe.domain.base.exception.AuthenticationException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.user.value.TokenType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    public long getAccessJwtExpiration() {
        return TimeUnit.MILLISECONDS.toSeconds(jwtProperties.getExpiration());
    }

    public long getRefreshJwtExpiration() {
        return TimeUnit.MILLISECONDS.toSeconds(jwtProperties.getRefreshExpiration());
    }

    public String generateAccessJwtToken(String username, String email, String role) {
        log.info("generateAccessJwtToken > username: [{}], email: [{}], role: [{}]", username, email, role);
        return tokenBuilder(username, email, role)
                .setExpiration(Date.from(Instant.now().plus(jwtProperties.getExpiration(), ChronoUnit.MILLIS)))
                .signWith(jwtProperties.getAccessKey())
                .compact();
    }

    private JwtBuilder tokenBuilder(String username, String email, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim(JwtTokenClaims.ROLE.name(), role)
                .claim(JwtTokenClaims.EMAIL.name(), email)
                .setIssuedAt(new Date(System.currentTimeMillis()));
    }

    public String generateJwtRefreshToken(String username, String email, String role) {
        log.info("generateJwtRefreshToken > username: [{}], email: [{}], role: [{}]", username, email, role);
        return tokenBuilder(username, email, role)
                .setExpiration(Date.from(Instant.now().plus(jwtProperties.getRefreshExpiration(), ChronoUnit.MILLIS)))
                .signWith(jwtProperties.getRefreshKey())
                .compact();
    }

    public String getEmailFromAccessJwtToken(String token) {
        return getClaims(jwtProperties.getAccessKey(), token).get(JwtTokenClaims.EMAIL.name(), String.class);
    }

    private Claims getClaims(Key key, String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public String getEmailFromRefreshJwtToken(String token) {
        return getClaims(jwtProperties.getRefreshKey(), token).get(JwtTokenClaims.EMAIL.name(), String.class);
    }

    public JwtTokenType getJwtTokenType(String token) {
        if (isValidAccessToken(token)) return JwtTokenType.ACCESS_TOKEN;
        else if (isValidRefreshToken(token)) return JwtTokenType.REFRESH_TOKEN;
        else return JwtTokenType.INVALID_TOKEN;
    }

    public boolean isValidAccessToken(String token) {
        try {
            getClaims(jwtProperties.getAccessKey(), token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isValidRefreshToken(String token) {
        try {
            getClaims(jwtProperties.getRefreshKey(), token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void validateRefreshToken(String token) {
        try {
            getClaims(jwtProperties.getRefreshKey(), token);
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
            throw new AuthenticationException(ReasonCode.JWT_EXPIRED_ERROR, e.getMessage());
        } catch (Exception e) {
            log.error("JWT refresh token is not valid");
            throw new AuthenticationException(ReasonCode.BAD_REFRESH_TOKEN, e.getMessage());
        }
    }

    public boolean validateJwtToken(String token, JwtTokenType jwtTokenType) {
        log.info("validateJwtToken token type is: [{}]", jwtTokenType);
        if (jwtTokenType.isInvalidToken()) return false;
        try {
            Jwts.parserBuilder().setSigningKey(jwtTokenType.isAccessToken() ? jwtProperties.getAccessKey() : jwtProperties.getRefreshKey()).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new AuthenticationException(ReasonCode.JWT_EXPIRED_ERROR, e.getMessage());
        } catch (Exception e) {
            throw new BadCredentialsException("not valid jwt token", e);
        }
    }

    public String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith(TokenType.BEARER_PREFIX)) {
            return headerAuth.substring(7);
        }
        return null;
    }
}
