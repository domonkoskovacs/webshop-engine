package hu.webshop.engine.webshopbe.domain.util;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class Constants {

    /**
     * IMAGE_URL_SEPARATOR can't be the same as CSV_SEPARATOR
     */
    public static final String IMAGE_URL_SEPARATOR = ",";

    /**
     * CSV_SEPARATOR can't be the same as IMAGE_URL_SEPARATOR
     */
    public static final String CSV_SEPARATOR = ";";

    public static final String DAY_OF_WEEK_SEPARATOR = ",";

    public static final String GENERATE_KEY = "generate";

    public static final String PRODUCTION_PROFILE = "prod";
}
