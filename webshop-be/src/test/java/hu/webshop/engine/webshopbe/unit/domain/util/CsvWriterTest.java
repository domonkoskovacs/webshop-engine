package hu.webshop.engine.webshopbe.unit.domain.util;

import static hu.webshop.engine.webshopbe.domain.util.CSVWriter.formatDate;
import static hu.webshop.engine.webshopbe.domain.util.CSVWriter.handleOutOfBounds;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;

import java.io.UncheckedIOException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopbe.domain.base.exception.CsvException;
import hu.webshop.engine.webshopbe.domain.order.entity.Order;
import hu.webshop.engine.webshopbe.domain.util.CSVWriter;

@DisplayName("Csv writer unit tests")
class CsvWriterTest {

    @Test
    @DisplayName("bad constructor call throws exception")
    void badConstructorCallThrowsException() {
        //Given
        List<String> dataList = new ArrayList<>();
        String[] headers = {"a", "b"};
        List<Function<String, ?>> columnExtractors = List.of(String::getBytes);

        //When //Then
        assertThatThrownBy(() -> new CSVWriter<>(dataList, headers, columnExtractors))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("format date is correct")
    void formatDateIsCorrect() {
        //Given
        OffsetDateTime dateTime = OffsetDateTime.now();

        //When
        String date = formatDate(dateTime);

        //Then
        assertThat(date).hasSize(19);
    }

    @Test
    @DisplayName("null date format and plain text works")
    void nullDateFormatAndPlainTextWorks() {
        //Given
        List<Order> dataList = List.of(
                Order.builder()
                        .orderDate(null)
                        .totalPrice(10.0)
                        .build()
        );
        String[] headers = {"orderDate", "totalPrice"};
        List<Function<Order, ?>> columnExtractors = List.of(
                Order::getOrderDate,
                Order::getTotalPrice
        );

        //When
        String csv = new CSVWriter<>(dataList, headers, columnExtractors)
                .asString();

        //Then
        assertThat(csv).isNotBlank();
    }

    @Test
    @DisplayName("handle out of bounds is correct")
    void handleOutOfBoundsIsCorrect() {
        //Given
        List<Integer> list = List.of(10, 20, 30);
        Function<Integer, String> mapper = i -> "Value: " + i;

        //When
        String result = handleOutOfBounds(list, 1, mapper);

        //Then
        assertThat(result).isEqualTo("Value: 20");
    }

    @Test
    @DisplayName("out of bounds list handled")
    void outOfBoundsListHandled() {
        //Given
        List<Integer> list = List.of(10, 20, 30);
        Function<Integer, String> mapper = i -> "Value: " + i;

        //When
        String result = handleOutOfBounds(list, 5, mapper);

        //Then
        assertThat(result).isNull();
    }

    @Test
    void testWriteToStringCatchesIOException() {
        //Given
        List<String> dataList = List.of("test");
        String[] header = new String[]{"col1"};
        Function<String, Object> faultyExtractor = value -> {
            throw new UncheckedIOException(new java.io.IOException("Simulated IO error"));
        };
        CSVWriter<String> writer = new CSVWriter<>(dataList, header, List.of(faultyExtractor));

        //When
        Throwable exception = catchThrowable(writer::asString);

        //Then
        assertThat(exception).isInstanceOf(CsvException.class);
    }

    @Test
    @DisplayName("format date returns null if called with null")
    void formatDateReturnsNullIfCalledWithNull() {
        //Given //When //Then
        assertThat(formatDate(null)).isNull();
    }
}
