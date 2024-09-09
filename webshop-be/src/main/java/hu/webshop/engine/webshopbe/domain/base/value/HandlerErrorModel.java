package hu.webshop.engine.webshopbe.domain.base.value;

import java.util.ArrayList;
import java.util.List;

public record HandlerErrorModel(List<ResultEntry> info, List<ResultEntry> error, List<ResultEntry> warning) {

    public HandlerErrorModel() {
        this(new ArrayList<>(), new ArrayList<>(), new ArrayList<>());
    }

    public void addError(ResultEntry error) {
        this.error.add(error);
    }

    public void addErrors(List<ResultEntry> errors) {
        this.error.addAll(errors);
    }
}
