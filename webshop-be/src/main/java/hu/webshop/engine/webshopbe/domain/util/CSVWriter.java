package hu.webshop.engine.webshopbe.domain.util;

import java.io.IOException;
import java.io.StringWriter;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;

import hu.webshop.engine.webshopbe.domain.base.exception.CsvException;
import hu.webshop.engine.webshopbe.domain.base.value.ReasonCode;
import hu.webshop.engine.webshopbe.domain.util.value.EncodingType;
import lombok.extern.slf4j.Slf4j;

/**
 * writes object lists to string, with a given header and corresponding column extractor lambdas
 * can be encoded as base64
 *
 * @param <T>
 */
@Slf4j
public class CSVWriter<T> {
    private final List<T> dataList;
    private final String[] header;
    private final List<Function<T, ?>> columnExtractors;
    private EncodingType encodingType;

    public CSVWriter(List<T> dataList, String[] header, List<Function<T, ?>> columnExtractors) {
        if (header.length != columnExtractors.size()) {
            throw new IllegalArgumentException("Header length must match the number of column extractors");
        }
        this.dataList = dataList;
        this.header = header;
        this.columnExtractors = columnExtractors;
        this.encodingType = EncodingType.PLAIN_TEXT;
    }

    /**
     * util function to avoid out of bounds exception in extractor lambdas
     *
     * @param list            data list
     * @param index           index to be retrieved
     * @param mappingFunction defines the value extraction
     * @param <R>             return type of mapping function, usually String
     * @param <L>             type of value
     * @return res of mapping function or null while avoiding null pointer and index out of bounds
     */
    public static <R, L> R handleOutOfBounds(List<L> list, int index, Function<L, R> mappingFunction) {
        try {
            return valueOfNullable(list.get(index), mappingFunction);
        } catch (IndexOutOfBoundsException e) {
            return null;
        }
    }

    /**
     * util function to avoid null pointer exception in column extractor lambdas
     *
     * @param value           object that need null check
     * @param mappingFunction defines the value extraction
     * @param <R>             return type of mapping function, usually String
     * @param <L>             type of value
     * @return res of mapping function or null, while avoiding null pointer
     */
    public static <R, L> R valueOfNullable(L value, Function<L, R> mappingFunction) {
        return Optional.ofNullable(value)
                .map(mappingFunction)
                .orElse(null);
    }

    /**
     * formats date for csv
     *
     * @return formatted date
     */
    public static String formatDate(OffsetDateTime date) {
        if (date != null) return date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return null;
    }

    public CSVWriter<T> base64() {
        this.encodingType = EncodingType.BASE_64;
        return this;
    }

    public String asString() {
        return switch (encodingType) {
            case PLAIN_TEXT -> writeToString();
            case BASE_64 -> encodeToBase64(writeToString());
        };
    }

    private String writeToString() {
        StringWriter stringWriter = new StringWriter();
        CSVFormat format = CSVFormat.Builder.create(CSVFormat.DEFAULT).setHeader(header).setDelimiter(Constants.CSV_SEPARATOR).build();
        try (CSVPrinter csvPrinter = new CSVPrinter(stringWriter, format)) {
            for (T data : dataList) {
                csvPrinter.printRecord(mapToRecord(data));
            }
        } catch (IOException e) {
            log.error("Unexpected error during csv generation: ", e);
            throw new CsvException(ReasonCode.CSV_ERROR, e.getMessage());
        }
        return stringWriter.toString();
    }

    private Stream<String> mapToRecord(T data) {
        return columnExtractors.stream().map(extractor -> getStringValue(extractor.apply(data)));
    }

    private String getStringValue(Object value) {
        return value != null ? value.toString() : null;
    }

    private String encodeToBase64(String csv) {
        byte[] bytes = csv.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}