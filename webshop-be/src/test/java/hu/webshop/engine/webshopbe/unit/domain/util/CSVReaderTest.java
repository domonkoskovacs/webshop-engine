package hu.webshop.engine.webshopbe.unit.domain.util;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowable;
import static org.assertj.core.groups.Tuple.tuple;

import java.util.List;
import java.util.Objects;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import hu.webshop.engine.webshopbe.domain.base.exception.CsvException;
import hu.webshop.engine.webshopbe.domain.util.CSVReader;
import lombok.Data;

@DisplayName("CSV reader unit tests")
class CSVReaderTest {

    @Test
    @DisplayName("plain text read is correct")
    void plainTextReadIsCorrect() {
        //Given
        String csv = "name;age\nAlice;30\nBob;25\n";
        CSVReader<TestDto> reader = new CSVReader<>(TestDto.class, new String[]{"firstColumn", "secondColumn"})
                .csv(csv)
                .registerValidator("firstColumn", Objects::nonNull)
                .registerValidator("secondColumn", Objects::nonNull)
                .validate();

        //When
        List<TestDto> result = reader.parse();

        //Then
        assertThat(result)
                .hasSize(2)
                .extracting("firstColumn", "secondColumn")
                .containsExactly(
                        tuple("Alice", "30"),
                        tuple("Bob", "25")
                );
    }

    @Test
    @DisplayName("no row results in error")
    void noRowResultsInError() {
        //Given
        String csv = "name;age\n";
        CSVReader<TestDto> reader = new CSVReader<>(TestDto.class, new String[]{"firstColumn", "secondColumn"})
                .csv(csv);

        //When
        Throwable exception = catchThrowable(reader::validate);

        //Then
        assertThat(exception).isInstanceOf(CsvException.class);
        assertThat(((CsvException) exception).getResponse().error()).hasSize(1);
    }

    @Test
    @DisplayName("bad column count results in error")
    void badColumnCountResultsInError() {
        //Given
        String csv = "name;age\nBob\n";
        CSVReader<TestDto> reader = new CSVReader<>(TestDto.class, new String[]{"firstColumn", "secondColumn"})
                .csv(csv);

        //When
        Throwable exception = catchThrowable(reader::validate);

        //Then
        assertThat(exception).isInstanceOf(CsvException.class);
        assertThat(((CsvException) exception).getResponse().error()).hasSize(1);
    }

    @Test
    @DisplayName("validator catches validation error correctly")
    void validatorCatchesValidationErrorCorrectly() {
        //Given
        String csv = "name;age\nBob;10\n";
        CSVReader<TestDto> reader = new CSVReader<>(TestDto.class, new String[]{"firstColumn", "secondColumn"})
                .csv(csv)
                .registerValidator("firstColumn", String::isEmpty);

        //When
        Throwable exception = catchThrowable(reader::validate);

        //Then
        assertThat(exception).isInstanceOf(CsvException.class);
        assertThat(((CsvException) exception).getResponse().error()).hasSize(1);
    }

    @Test
    @DisplayName("malformed csv throws upload error on validate")
    void malformedCsvThrowsUploadErrorOnValidate() {
        //Given
        String malformed = "firstColumn;secondColumn\n\"Alice;30";
        CSVReader<TestDto> reader = new CSVReader<>(TestDto.class, new String[]{"firstColumn", "secondColumn"})
                .csv(malformed);

        //When //Then
        assertThatThrownBy(reader::validate)
                .isInstanceOf(CsvException.class)
                .satisfies(ex ->
                        assertThat(((CsvException) ex).getResponse().error())
                                .hasSize(1));
    }

    @Test
    @DisplayName("malformed csv throws upload error on parse")
    void malformedCsvThrowsUploadErrorOnParse() {
        //Given
        String malformed = "firstColumn;secondColumn\n\"Alice;30";
        CSVReader<TestDto> reader = new CSVReader<>(TestDto.class, new String[]{"firstColumn", "secondColumn"})
                .csv(malformed);

        //When //Then
        assertThatThrownBy(reader::parse)
                .isInstanceOf(CsvException.class)
                .satisfies(ex ->
                        assertThat(((CsvException) ex).getResponse().error())
                                .hasSize(1));
    }

    @Data
    public static class TestDto {
        private String firstColumn;
        private String secondColumn;
    }
}
