package hu.webshop.engine.webshopbe.unit.domain.util;


import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.assertj.core.api.BDDAssertions.then;

import java.time.LocalDate;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopbe.domain.util.TimeUtil;
import hu.webshop.engine.webshopbe.domain.util.value.DateBetween;

@DisplayName("Time util unit tests")
class TimeUtilTest {

    @Test
    @DisplayName("either date is null")
    void eitherDateIsNull() {
        //Given //When
        DateBetween dateBetween = TimeUtil.validateAndSetDateBetween(null, null);

        //Then
        assertThat(dateBetween.from()).isEqualTo(LocalDate.now().withDayOfMonth(1));
        assertThat(dateBetween.to()).isEqualTo(LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth()));
    }

    @Test
    @DisplayName("bad order results in an exception")
    void badOrderResultsInAnException() {
        //Given
        LocalDate from = LocalDate.of(2024, 10, 10);
        LocalDate to = LocalDate.of(2024, 9, 10);

        //When
        var throwable = catchThrowable(() -> TimeUtil.validateAndSetDateBetween(from, to));

        //Then
        then(throwable).isInstanceOf(IllegalStateException.class);
    }
}
