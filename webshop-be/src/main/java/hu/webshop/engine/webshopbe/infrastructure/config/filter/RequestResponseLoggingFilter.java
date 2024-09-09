package hu.webshop.engine.webshopbe.infrastructure.config.filter;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RequestResponseLoggingFilter extends OncePerRequestFilter {

    private static final List<String> NOT_LOGGED_PATHS = List.of("/swagger", "/actuator", "/v3/api-docs");

    /**
     * logs every incoming and outgoing request
     * NOT_LOGGED_PATHS ignored
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);
        filterChain.doFilter(wrappedRequest, wrappedResponse);
        if (NOT_LOGGED_PATHS.stream().noneMatch(wrappedRequest.getRequestURI()::contains)) {
            logRequest(wrappedRequest);
            logResponse(wrappedResponse);
        }
        wrappedResponse.copyBodyToResponse();
    }

    private void logRequest(HttpServletRequest request) throws IOException {
        log.info("======> [{}] {}, header: {}, body: \n{}",
                request.getMethod(),
                request.getRequestURI(),
                getHeadersInfo(request),
                getRequestBody(request));

    }

    private String getHeadersInfo(HttpServletRequest request) {
        return Collections.list(request.getHeaderNames())
                .stream()
                .map(headerName -> headerName + ":" + Collections.list(request.getHeaders(headerName)))
                .collect(Collectors.joining(", "));
    }

    private String getRequestBody(HttpServletRequest request) throws IOException {
        try (BufferedReader bufferedReader = request.getReader()) {
            return bufferedReader.lines().collect(Collectors.joining("\n"));
        }
    }

    private void logResponse(ContentCachingResponseWrapper response) {
        log.info("<====== status: {}, header: {}, body: \n{}",
                response.getStatus(),
                getHeadersInfo(response),
                getResponseBody(response.getContentAsByteArray()));
    }

    private String getResponseBody(byte[] content) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper
                    .enable(SerializationFeature.INDENT_OUTPUT)
                    .writerWithDefaultPrettyPrinter().writeValueAsString(objectMapper.readTree(content));
        } catch (Exception e) {
            return "cannot read response body";
        }
    }

    private String getHeadersInfo(HttpServletResponse response) {
        return response.getHeaderNames()
                .stream()
                .map(headerName -> headerName + ":" + response.getHeaders(headerName))
                .collect(Collectors.joining(", "));
    }
}
