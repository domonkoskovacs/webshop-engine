package hu.webshop.engine.webshopbe.infrastructure.config.filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import hu.webshop.engine.webshopbe.domain.auth.JwtService;
import hu.webshop.engine.webshopbe.domain.user.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String token = jwtService.parseJwt(request);

        if (!request.getRequestURI().contains("auth") && jwtService.isValidAccessToken(token)) {
            handleAccessToken(request, token);
        } else {
            log.warn("Cannot set security context for api endpoints, authentication failed, only public endpoints can be accessed");
        }

        filterChain.doFilter(request, response);
    }

    /**
     * handling access token, setting authentication
     *
     * @param request req
     * @param jwt     token
     */
    private void handleAccessToken(HttpServletRequest request, String jwt) {
        log.info("handleAccessToken");
        String email = jwtService.getEmailFromAccessJwtToken(jwt);
        //loads by email
        UserDetails userDetails = userService.loadUserByUsername(email);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        //we specify the user in the context,
        //after this the token passes the security filter
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.info("authentication successful");
    }
}
