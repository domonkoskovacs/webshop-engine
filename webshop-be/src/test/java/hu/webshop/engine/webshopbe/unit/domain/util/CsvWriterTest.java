package hu.webshop.engine.webshopbe.unit.domain.util;

import static hu.webshop.engine.webshopbe.domain.util.CSVWriter.formatDate;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

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
}
