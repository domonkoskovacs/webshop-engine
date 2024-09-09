package hu.webshop.engine.webshopbe.domain.util;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Predicate;
import java.util.stream.IntStream;

import com.opencsv.CSVParser;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.bean.ColumnPositionMappingStrategy;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import hu.webshop.engine.webshopbe.domain.base.exception.CsvException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.base.value.ResultEntry;
import hu.webshop.engine.webshopbe.domain.util.value.EncodingType;
import lombok.extern.slf4j.Slf4j;

/**
 * validates and parses csv files
 *
 * @param <T> needs to have a @NoArgConstructor in order to parse into objects
 */
@Slf4j
public class CSVReader<T> {

    private final Class<T> clazz;
    private final String[] columnNames;
    private final Map<String, Predicate<String>> columnValidators;
    private EncodingType encodingType;
    private String csv;

    public CSVReader(Class<T> clazz, String[] columnNames) {
        this.clazz = clazz;
        this.columnNames = columnNames;
        this.encodingType = EncodingType.PLAIN_TEXT;
        this.csv = "";
        this.columnValidators = new HashMap<>();
    }

    public CSVReader<T> base64() {
        this.encodingType = EncodingType.BASE_64;
        return this;
    }

    public CSVReader<T> csv(String csv) {
        this.csv = csv;
        return this;
    }

    public CSVReader<T> registerValidator(String columnName, Predicate<String> validator) {
        columnValidators.put(columnName, validator);
        return this;
    }

    @SafeVarargs
    public final CSVReader<T> registerValidator(String columnName, Predicate<String>... validators) {
        for (Predicate<String> validator : validators) {
            columnValidators.put(columnName, validator);
        }
        return this;
    }

    public CSVReader<T> validate() {
        if (Objects.requireNonNull(encodingType) == EncodingType.PLAIN_TEXT) {
            validateCsvString(csv);
        } else if (encodingType == EncodingType.BASE_64) {
            validateCsvString(decodeFromBase64(csv));
        }
        return this;
    }

    public void validateCsvString(String csv) {
        List<ResultEntry> errors = new ArrayList<>();
        List<String[]> rows = parseRows(csv);
        if (rows == null || rows.size() < 2) {
            errors.add(ResultEntry.resultEntry(ReasonCode.CSV_UPLOAD_ERROR, "Invalid csv file, must contain more than 1 row"));
        }
        if (rows != null && rows.stream().anyMatch(row -> row.length != columnNames.length)) {
            errors.add(ResultEntry.resultEntry(ReasonCode.CSV_UPLOAD_ERROR, "Not all rows match the required column number"));
        }
        columnValidators.forEach((columnName, columnValidator) -> {
            assert rows != null;
            rows.subList(1, rows.size()).forEach(row -> {
                if (Boolean.FALSE.equals(columnValidator.test(getColumnValue(row, columnName)))) {
                    errors.add(ResultEntry.resultEntry(ReasonCode.CSV_UPLOAD_ERROR, String.format("Validation failed for column: %s, at row: %s", columnName, rows.indexOf(row))));
                }
            });
        });
        if (!errors.isEmpty()) {
            log.error("error: [{}]", errors);
            throw new CsvException(errors);
        }
    }

    private String getColumnValue(String[] row, String columnName) {
        int index = IntStream.range(0, columnNames.length).filter(i -> columnNames[i].equals(columnName)).findFirst().orElse(-1);
        return index >= 0 && index < row.length ? row[index] : null;
    }

    private List<String[]> parseRows(String csv) {
        log.debug("parseRows > csv: [{}], encodingType: [{}]", csv, encodingType);
        CSVParser csvParser = new CSVParserBuilder().withSeparator(Constants.CSV_SEPARATOR.charAt(0)).build();
        try (com.opencsv.CSVReader csvReader = new CSVReaderBuilder(new BufferedReader(new InputStreamReader(new ByteArrayInputStream(csv.getBytes()), StandardCharsets.UTF_8))).withCSVParser(csvParser).build()) {
            return csvReader.readAll();
        } catch (IOException | com.opencsv.exceptions.CsvException e) {
            log.error("Error occurred during csv parsing: ", e);
            throw new CsvException(ReasonCode.CSV_UPLOAD_ERROR, e.getMessage());
        }
    }

    private String decodeFromBase64(String csv) {
        byte[] bytes = Base64.getDecoder().decode(csv);
        return new String(bytes, StandardCharsets.UTF_8);
    }

    public List<T> parse() {
        return switch (encodingType) {
            case PLAIN_TEXT -> parseFromString(csv);
            case BASE_64 -> parseFromString(decodeFromBase64(csv));
        };
    }

    private List<T> parseFromString(String csv) {
        ColumnPositionMappingStrategy<T> strategy = new ColumnPositionMappingStrategy<>();
        strategy.setType(clazz);
        strategy.setColumnMapping(columnNames);
        try (com.opencsv.CSVReader csvReader = new CSVReaderBuilder(new BufferedReader(new InputStreamReader(new ByteArrayInputStream(csv.getBytes()), StandardCharsets.UTF_8))).withCSVParser(new CSVParserBuilder().withSeparator(Constants.CSV_SEPARATOR.charAt(0)).build()).withSkipLines(1).build()) {
            CsvToBean<T> csvToBean = new CsvToBeanBuilder<T>(csvReader).withMappingStrategy(strategy).withType(clazz).build();
            return csvToBean.parse();
        } catch (Exception e) {
            log.error("Unexpected error happened during csv parsing: ", e);
            throw new CsvException(ReasonCode.CSV_ERROR, e.getMessage());
        }
    }
}