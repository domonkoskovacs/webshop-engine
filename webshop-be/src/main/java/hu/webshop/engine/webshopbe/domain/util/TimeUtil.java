package hu.webshop.engine.webshopbe.domain.util;

import java.time.LocalDate;

import hu.webshop.engine.webshopbe.domain.util.value.DateBetween;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TimeUtil {

    /**
     * if state is correct but values are null, gives back the current month
     *
     * @return valid dates
     */
    public static DateBetween validateAndSetDateBetween(LocalDate from, LocalDate to) {
        if (from == null || to == null) {
            log.debug("One or two dates are null, using the start and end of the current month");
            return new DateBetween(LocalDate.now().withDayOfMonth(1), LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()));
        }
        if (to.isBefore(from)) {
            throw new IllegalStateException("start date of the statistics can't be after the end date");
        }
        return new DateBetween(from, to);
    }
}
