package hu.webshop.engine.webshopqa.configuration;

import java.io.IOException;
import java.util.Properties;

public class TestConfiguration {
    private static final Properties props = new Properties();

    static {
        try (var stream = TestConfiguration.class.getClassLoader().getResourceAsStream("test-config.properties")) {
            if (stream != null) {
                props.load(stream);
            }
        } catch (IOException e) {
            throw new RuntimeException("Cannot load test config", e);
        }
    }

    private static String get(String key) {
        return System.getProperty(key, props.getProperty(key));
    }

    private static Environment getEnvironmentEnum() {
        String envValue = get("environment");
        try {
            return Environment.valueOf(envValue.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new IllegalStateException("Invalid or missing environment value: " + envValue, e);
        }
    }

    private static String getPerformanceBaseUrlLocal() {
        return get("performance.baseUrl.local");
    }

    private static String getPerformanceBaseUrlProd() {
        return get("performance.baseUrl.prod");
    }

    private static String getUiBaseUrlLocal() {
        return get("ui.baseUrl.local");
    }

    private static String getUiBaseUrlProd() {
        return get("ui.baseUrl.prod");
    }

    public static String getUiBaseUrl() {
        return switch (getEnvironmentEnum()) {
            case LOCAL -> getUiBaseUrlLocal();
            case PROD -> getUiBaseUrlProd();
        };
    }

    public static String getPerformanceBaseUrl() {
        return switch (getEnvironmentEnum()) {
            case LOCAL -> getPerformanceBaseUrlLocal();
            case PROD -> getPerformanceBaseUrlProd();
        };
    }

    public static PerformanceTestType getPerformanceTestType() {
        String raw = get("performance.testType");
        return PerformanceTestType.fromString(raw);
    }

    public static String getUiUserEmail() {
        String email = get("ui.user.email");
        if (email == null || email.isBlank()) {
            throw new IllegalStateException("Missing required property: ui.user.email");
        }
        return email;
    }

    public static String getUiUserPassword() {
        String password = get("ui.user.password");
        if (password == null || password.isBlank()) {
            throw new IllegalStateException("Missing required property: ui.user.password");
        }
        return password;
    }

}
