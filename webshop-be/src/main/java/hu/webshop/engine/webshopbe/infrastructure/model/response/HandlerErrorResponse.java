package hu.webshop.engine.webshopbe.infrastructure.model.response;

import java.util.List;

import hu.webshop.engine.webshopbe.domain.base.value.ResultEntry;

public record HandlerErrorResponse(List<ResultEntry> info, List<ResultEntry> error, List<ResultEntry> warning) {
}
