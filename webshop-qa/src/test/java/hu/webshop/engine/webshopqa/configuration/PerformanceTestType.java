package hu.webshop.engine.webshopqa.configuration;

public enum PerformanceTestType {
    SMOKE,
    STRESS,
    SOAK,
    CAPACITY,
    BREAKPOINT,
    RAMP_HOLD;

    public static PerformanceTestType fromString(String raw) {
        if (raw == null || raw.isBlank()) {
            return SMOKE;
        }
        try {
            return PerformanceTestType.valueOf(raw.toUpperCase().replace("-", "_"));
        } catch (IllegalArgumentException e) {
            System.err.println("Unknown test type: '" + raw + "', falling back to SMOKE.");
            return SMOKE;
        }
    }
}
