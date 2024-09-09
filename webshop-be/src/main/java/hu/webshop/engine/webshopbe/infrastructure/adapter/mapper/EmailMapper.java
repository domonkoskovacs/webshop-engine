package hu.webshop.engine.webshopbe.infrastructure.adapter.mapper;

import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import hu.webshop.engine.webshopbe.domain.email.entity.PromotionEmail;
import hu.webshop.engine.webshopbe.domain.util.Constants;
import hu.webshop.engine.webshopbe.infrastructure.model.request.PromotionEmailRequest;
import hu.webshop.engine.webshopbe.infrastructure.model.response.PromotionEmailResponse;

@Mapper
public interface EmailMapper {

    @Mapping(target = "dayOfWeek", source = "dayOfWeek", qualifiedByName = "toStringDayOfWeek")
    PromotionEmail fromRequest(PromotionEmailRequest request);

    PromotionEmailResponse toResponse(PromotionEmail entity);

    List<PromotionEmailResponse> toResponseList(List<PromotionEmail> entities);

    @Named("toStringDayOfWeek")
    default String toStringDayOfWeek(List<DayOfWeek> dayOfWeeks) {
        return dayOfWeeks.stream()
                .map(Enum::name)
                .collect(Collectors.joining(Constants.DAY_OF_WEEK_SEPARATOR));
    }
}
