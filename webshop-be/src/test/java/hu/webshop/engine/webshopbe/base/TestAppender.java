package hu.webshop.engine.webshopbe.base;

import org.apache.commons.collections4.MultiValuedMap;
import org.apache.commons.collections4.multimap.ArrayListValuedHashMap;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.AppenderBase;
import lombok.Getter;

public class TestAppender extends AppenderBase<ILoggingEvent> {

    @Getter
    private static final MultiValuedMap<String, ILoggingEvent> events = new ArrayListValuedHashMap<>();

    @Override
    protected void append(ILoggingEvent event) {
        events.put(event.getLoggerName(), event);
    }
}
